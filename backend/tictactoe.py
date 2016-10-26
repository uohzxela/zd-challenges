def prompt():
    """Returns user input after the prompt."""
    print ">>",
    return raw_input()


def input_board_size():
    """Prompts user for board size."""
    print "Enter board size:"
    try:
        return int(prompt())
    except ValueError:
        print "Invalid input, defaulting to board size of 3."
        return 3


def input_p1_name():
    """Prompts user for name of Player 1."""
    print "Enter name for Player 1:"
    return prompt()


def input_p2_name():
    """Prompts user for name of Player 2."""
    print "Enter name for Player 2:"
    return prompt()


def get_players_and_board():
    """Gets all the necessary user input
    and returns metadata as a tuple.

    Args: None.

    Returns:
        tuple: (players data, generated board)

    """
    B = generate_board(input_board_size())
    P1_MARKER = 'x'
    P2_MARKER = 'o'
    PLAYERS = [(input_p1_name(), P1_MARKER),
               (input_p2_name(), P2_MARKER)]
    return PLAYERS, B


def output_board_is_full():
    """Print game over message."""
    print "No one wins. Board is full."


def output_winner(player_data):
    """Print the winner of the game given the player data."""
    name, _ = player_data
    print "Congratulations {}! You have won.".format(name)


def make_move(B, player_data):
    """Prompts user for the move, mark the board
    and returns the position of the move.

    If the input is invalid, the prompt is repeated.

    Args:
        B (list of lists): The board.
        player_data (tuple): Player name and marker.

    Returns:
        tuple: Position of the move.

    """
    name, marker = player_data
    print "{}, choose a box to place '{}' into:".format(name, marker)
    while True:
        try:
            box_idx = int(prompt())-1
        except ValueError:
            print ("Oops {}, your input is invalid, please try again:"
                   .format(name))
            continue
        i, j = box_idx / len(B), box_idx % len(B)
        if B[i][j].isdigit():
            B[i][j] = marker
            break
        else:
            print ("Sorry {}, this box is already filled, please try again:"
                   .format(name))
    return (i, j)


def generate_board(N):
    """Returns a 2D matrix with cells labeled
    in ascending order starting from 1."""
    return [[str(N*i+j+1) for j in xrange(N)] for i in xrange(N)]


def print_board(B):
    """Print given board of any arbitrary size."""
    N = len(B)
    max_box_padding = len(str(N**2))
    print
    for i in xrange(N):
        row_len = 0
        print "",
        for j in xrange(N):
            val = B[i][j]
            padding = " "*(max_box_padding - len(str(val)))
            divider = "|" if j < N-1 else ""
            box = "{}{} {}".format(val, padding, divider)
            print box,
            row_len += len(box)+1
        print
        if i < N-1:
            print "-"*(row_len)
    print


def is_winnable(B, move):
    """Checks if the given move is a winning move.

    Args:
        B (list of lists): The board.
        move (tuple): Position of the move.

    Returns:
        bool: True if the move is winnable, otherwise False.

    """
    i, j = move
    return (is_winnable_horizontally(B, i, j) or
            is_winnable_vertically(B, i, j) or
            is_winnable_diagonally(B, i, j) or
            is_winnable_anti_diagonally(B, i, j))


def is_winnable_horizontally(B, i, j):
    """Returns True if there is a row containing (i,j)
    with 3 identical markers, otherwise False."""
    marker = B[i][j]
    N = len(B)
    # case 1: val | val | x
    if (j-1 >= 0 and j-2 >= 0 and
            B[i][j-1] == marker and
            B[i][j-2] == marker):
        return True
    # case 2: val | x | val
    if (j-1 >= 0 and j+1 < N and
            B[i][j-1] == marker and
            B[i][j+1] == marker):
        return True
    # case 3: x | val | val
    if (j+1 < N and j+2 < N and
            B[i][j+1] == marker and
            B[i][j+2] == marker):
        return True
    return False


def is_winnable_vertically(B, i, j):
    """Returns True if there is a column containing (i,j)
    with 3 identical markers, otherwise False."""
    marker = B[i][j]
    N = len(B)
    # same cases as horizontal direction
    # but this time in vertical direction
    if (i-1 >= 0 and i-2 >= 0 and
            B[i-1][j] == marker and
            B[i-2][j] == marker):
        return True
    if (i-1 >= 0 and i+1 < N and
            B[i-1][j] == marker and
            B[i+1][j] == marker):
        return True
    if (i+1 < N and i+2 < N and
            B[i+1][j] == marker and
            B[i+2][j] == marker):
        return True
    return False


def is_winnable_diagonally(B, i, j):
    """Returns True if there is a diagonal containing (i,j)
    with 3 identical markers, otherwise False."""
    marker = B[i][j]
    N = len(B)
    # case 1:
    # val
    #    val
    #       x
    if (i-1 >= 0 and j-1 >= 0 and
            i-2 >= 0 and j-2 >= 0 and
            B[i-1][j-1] == marker and
            B[i-2][j-2] == marker):
        return True
    # case 2:
    # x
    #  val
    #     val
    if (i+1 < N and j+1 < N and
            i+2 < N and j+2 < N and
            B[i+1][j+1] == marker and
            B[i+2][j+2] == marker):
        return True
    # case 3:
    # val
    #    x
    #     val
    if (i-1 >= 0 and j-1 >= 0 and
            i+1 < N and j+1 < N and
            B[i-1][j-1] == marker and
            B[i+1][j+1] == marker):
        return True
    return False


def is_winnable_anti_diagonally(B, i, j):
    """Returns True if there is a anti-diagonal containing
    (i,j) with 3 identical markers, otherwise False."""
    marker = B[i][j]
    N = len(B)
    # case 1:
    #       x
    #    val
    # val
    if (i+1 < N and j-1 >= 0 and
            i+2 < N and j-2 >= 0 and
            B[i+1][j-1] == marker and
            B[i+2][j-2] == marker):
        return True
    # case 2:
    #     val
    #  val
    # x
    if (i-1 >= 0 and j+1 < N and
            i-2 >= 0 and j+2 < N and
            B[i-1][j+1] == marker and
            B[i-2][j+2] == marker):
        return True
    # case 3:
    #     val
    #    x
    # val
    if (i-1 >= 0 and j+1 < N and
            i+1 < N and j-1 >= 0 and
            B[i-1][j+1] == marker and
            B[i+1][j-1] == marker):
        return True
    return False


def play_game():
    """Driver function to initialize the game.
    The game keeps running prompting user for moves
    until there is a winner or the board is full.
    """
    PLAYERS, B = get_players_and_board()
    TOTAL_BOX_COUNT = len(B)**2

    move_count = 0
    prev_move = None

    while True:
        print_board(B)
        if prev_move and is_winnable(B, prev_move):
            output_winner(PLAYERS[(move_count-1) % 2])
            break
        if move_count == TOTAL_BOX_COUNT:
            output_board_is_full()
            break
        prev_move = make_move(B, PLAYERS[move_count % 2])
        move_count += 1


if __name__ == "__main__":
    play_game()
