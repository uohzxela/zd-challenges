def prompt():
	print ">>",
	return raw_input()


def input_board_size():
	print "Enter board size:"
	return int(prompt())


def input_p1_name():
	print "Enter name for Player 1:"
	return prompt()


def input_p2_name():
	print "Enter name for Player 2:"
	return prompt()


def get_position(B, box_idx):
	return box_idx / len(B), box_idx % len(B)


def place_marker(B, box_idx, marker):
	i, j = get_position(B, box_idx)
	B[i][j] = marker


def make_move(player_idx):
	name = PLAYERS[player_idx]
	marker = MARKERS[player_idx]
	print "{}, choose a box to place '{}' into:".format(name, marker)
	box_idx = prompt()
	place_marker(B, box_idx, marker)


def generate_board(N):
	B = [[0 for j in xrange(N)] for i in xrange(N)]
	num = 1
	for i in xrange(N):
		for j in xrange(N):
			B[i][j] = num 
			num += 1
	return B


def print_board(B):
	max_box_padding = len(str(len(B)**2))
	M, N = len(B), len(B[0])
	for i in xrange(M):
		row_len = 0
		print "",
		for j in xrange(N):
			val = B[i][j]
			padding = max_box_padding - len(str(val))
			has_delineation = j < N - 1
			box = "{}{} {}".format(
				val, 
				" "*(padding), 
				"|" if has_delineation else "")
			print box,
			row_len += len(box) + 1
		print
		if i < M - 1:
			print "-"*(row_len)


def is_board_full(moves):
	return moves >= N**2


def check_for_winning_move(B):
	pass


N = input_board_size()
P1_NAME = input_p1_name()
P2_NAME = input_p2_name()

print 'N:', N
print 'Player 1:', P1_NAME
print 'Player 2:', P2_NAME

P1_MARKER = 'X'
P2_MARKER = 'O'

PLAYERS = [P1_NAME, P2_NAME]
MARKERS = [P1_MARKER, P2_MARKER]

B = generate_board(N)
print_board(B)
moves = 0

while False:
	is_winnable, winner = check_for_winning_move(B)
	if is_winnable:
		output_winner(winner)
		break
	if is_board_full(moves):
		output_board_is_full()
		break
	print_board(B)
	make_move(moves % 2)
	moves += 1
	print_board(B)
