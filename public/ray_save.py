#!/usr/bin/env python3.4

import struct

f = open("S.bin", "wb")

f.write(struct.pack("<ffffff", -10, -10, 20, 0, 0, 0))

def tri(p0, p1, p2, c):
	f.write(struct.pack("<fffffffffBBB", p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], c[0], c[1], c[2]))


p0 = (-2, -2, 0)
p1 = ( 2, -2, 0)
p2 = (-2,  2, 0)
p3 = ( 2,  2, 0)

red = (255, 0, 0)
blue = (0, 0, 255)

tri(p0, p1, p2, red)
tri(p1, p2, p3, blue)

f.close()




