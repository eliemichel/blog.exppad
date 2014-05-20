#!/usr/bin/env python
#-*- coding: utf-8 -*-

import ircbot
#import irc.client as ircbot
import sys
import time
import re
import thread

debug = True
nickname = "pfcbot"
blacklist = ["bite", "fuck"]
pfc_index = {
	"pierre"  : 0,
	"caillou" : 0,
	"rock"    : 0,
	"stone"   : 0,
	"feuille" : 1,
	"papier"  : 1,
	"paper"   : 1,
	"ciseaux" : 2,
	"scissors": 2
}
rev_pfc_index = ["pierre", "feuille", "ciseaux"]

key_join = ["join", "play"]
key_leave = ["quit", "leave"]

admins = ["Elie"]

kick_delay = 10
restart_delay = 5

helpmsg = """
pfcbot est un bot permettant de jouer à pierre-feuille_ciseaux sur IRC.
Il attend que chacun des joueurs inscrits ait joué avant de donner le résultat et de relancer une nouvelle manche.
La communication avec pfcbot se fait par messages privés.

Pour participer, il suffit de lui dire 'join' ou 'play'.

Pour jouer, il faut envoyer l'un des mots clef suivants :
%s

Si vous lui envoyez un tel mot clef sans être inscrit, vous êtes automatiquement ajoutés à la partie.

Pour quitter la partie, utilisez 'quit' ou 'leave'.

Pour demander à exclure un joueur trop lent, dites 'kick nom_du_joueur'.
""" % (', '.join(pfc_index.keys()),)


nbtools = max(pfc_index.values()) + 1

class Pfcbot(ircbot.SimpleIRCClient):
	def __init__(self, target):
		ircbot.SimpleIRCClient.__init__(self)
		self.target = target
		self.server = None
		self.players = {}
		self.kick_players = {}
		self.round = {}
	
	def sayto(self, target, msg):
		if self.server == None:
			print("Target not joined yet : unable to say \"%s\"" % (msg,))
		else:
			self.server.privmsg(target, msg)


	def say(self, msg):
		self.sayto(self.target, "%c14%s" % (3, msg))

	def sayto_cl(self, player):
		return lambda msg: self.sayto(player, msg)

	def on_welcome(self, server, ev):
		print("Welcomed")
		if ircbot.is_channel(self.target):
			server.join(self.target)

	def on_join(self, server, ev):
		if ev.source().split("!")[0] == nickname:
			print("Joined")
			self.server = server
			self.new_round()
	
	def on_quit(self, server, ev):
		player = ev.source().split("!")[0]
		if player in self.players.keys():
			self.remove_player(player)

	def on_disconnect(self, server, ev):
		sys.exit(0)
	
	def on_privmsg(self, server, ev):
		chan = ev.target()
		msg_ = ev.arguments()[0]
		msg = msg_.lower()
		player = ev.source().split('!')[0]
		ans = self.sayto_cl(player)
		
		if player in self.kick_players.keys() and self.kick_players[player]:
			del self.kick_players[player]
			self.say("La demande d'exclusion contre %s a été annulée." % (player,))

		if msg in key_join:
			self.add_player(player)
		
		elif msg in key_leave or msg in blacklist:
			if player in self.players.keys():
				self.remove_player(player)
			else:
				ans("Vous ne jouez pas encore.")

		elif msg in pfc_index.keys():
			if not player in self.players:
				self.add_player(player)
			self.round[player] = pfc_index[msg]
			self.try_end_round()
		
		elif msg == "score":
			ans(" -- Scores --")
			for k, v in self.players.items():
				ans("  %s: %d" % (k, v))
		
		elif msg == "help":
			for line in helpmsg.split("\n"):
				ans(line)

		elif msg[0:5] == "kick ":
			target = msg_[5:]
			if target in self.players.keys():
				if target in self.kick_players.keys():
					ans("Une demande d'exclusion a déjà été faite pour %s" % (target,))
				else:
					self.sayto(self.target, "%s: %c14%s a demandé à vous exclure du jeu. Vous pouvez annuler cette demande en m'envoyant un MP dans les %ds à venir." % (target, 3, player, kick_delay))
					self.kick_players[target] = True
					thread.start_new_thread(self.wait_kick, (target,))
			else:
				ans("%s ne joue pas." % (target,))
		
		elif player in admins:
			if msg == "die":
				server.close()
			else:
				ans("Seuls les administrateurs peuvent utiliser cette instruction.")

		else:
			ans("Instruction non reconnue. Essayez 'help'.")

		print("privmsg: [%s] %s" % (player, msg))

	def wait_kick(self, player):
		time.sleep(kick_delay)
		if player in self.kick_players.keys() and self.kick_players[player]:
			self.remove_player(player)

	def add_player(self, player):
		self.players[player] = 0
		
		self.say("%s a rejoint le jeu." % (player, ))

	def remove_player(self, player):
		del self.players[player]
		if player in self.kick_players:
			del self.kick_players[player]
		if player in self.round:
			del self.round[player]
		self.say("%s a quitté le jeu." % (player, ))

	def try_end_round(self):
		if self.ingame and sum([1 for k in self.players.keys() if k not in self.round]) == 0:
			self.say(" -- Fin du round -- ")
			roundlist = [0]*nbtools
			for v in self.round.values():
				roundlist[v] += 1
			for k, v in self.round.items():
				s = roundlist[(v - 1) % nbtools] if roundlist[(v + 1) % nbtools] == 0 else -1
				self.players[k] += s
				if s >= 0:
					self.say("%s (%s) gagne %d points !" % (k, rev_pfc_index[self.round[k]], s))
				else:
					self.say("%s (%s) perd..." % (k, rev_pfc_index[self.round[k]]))
			self.round = {}
			thread.start_new_thread(self.wait_new_round, ())
	
	def wait_new_round(self):
		self.ingame = False
		time.sleep(restart_delay)
		self.new_round()

	def new_round(self):
		if len(self.players) < 2:
			thread.start_new_thread(self.wait_new_round, ())
		else:
			self.say(" -- Début du nouveau round -- (joueurs : %s)" % (", ".join(self.players.keys()),))
			self.ingame = True
			

def main():
	server = "ulminfo.fr"
	port = 6667
	target = "#courssysteme"

	c = Pfcbot(target)
	try:
		c.connect(server, port, nickname)
	except ircbot.ServerConnectionError as x:
		print(x)
		sys.exit(1)
	c.start()

if __name__ == "__main__":
	main()



