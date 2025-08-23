# -*- encoding: utf-8 -*-
import ply.yacc as yacc
from lex import tokens  # 从您的lex文件导入tokens

precedence = (
    ('left', 'ELSE', 'ELIF'),
    ('left', 'OR', 'AND'),
    ('nonassoc', 'EQ', 'IN'),
    ('right', 'NOT'),
)

def p_start(p):
    '''program : stmt_list'''
    p[0] = p[1]

def p_stmt_list(p):
    '''stmt_list : stmt_list statement
                 | '''
    if len(p) == 1:
        p[0] = []
    else:
        p[0] = p[1] + [p[2]]

def p_statement(p):
    '''statement : assignment
                 | definition
                 | conditional '''
    p[0] = p[1]

def p_assignment(p):
    '''assignment : VOCAL ASSIGN expr
                  | NEWID ASSIGN expr'''
    p[0] = ["assign", p[1], p[3]]

def p_definition(p):
    '''definition : DEF NEWID ASSIGN list
                  | DEF NEWID ASSIGN VOCAL'''
    p[0] = ["definition", p[2], p[4]]

def p_conditional(p):
    '''conditional : IF LPAREN expr RPAREN THEN stmt_block ENDIF
                   | IF LPAREN expr RPAREN THEN stmt_block ELSE stmt_block ENDIF'''
    if len(p) == 10:
        p[0] = ["if", p[3], "then", p[6], "else"] + [p[8]]
    elif len(p) == 8:
        p[0] = ["if", p[3], "then", p[6]]
    else:
        print("ERROR AT CONDITIONAL")

# def p_elif_part(p):
#     '''elif_part : elif_part ELIF LPAREN expr RPAREN THEN stmt_block END else_part
#                  | elif_part ELIF LPAREN expr RPAREN THEN stmt_block END
#                  | ELIF LPAREN expr RPAREN THEN stmt_block END
#                  | ELIF LPAREN expr RPAREN THEN stmt_block END else_part
#                  | '''
#     if len(p) == 8:
#         p[0] = [p[1], "if", p[4], "then", p[7]]
#     elif len(p) == 7:
#         p[0] = ["if", p[3], "then", p[6]]
#     else:
#         print("ERROR AT ELIF")

# def p_else_part(p):
#     '''else_part : ELSE stmt_block
#                  | '''
#     p[0] = ["else", p[2]]

def p_stmt_block(p):
    '''stmt_block : statement
                  | stmt_list'''
    p[0] = p[1]

def p_expr(p):
    '''expr : expr OR expr
            | expr AND expr
            | NOT expr
            | atom EQ atom
            | atom IN atom
            | LPAREN expr RPAREN
            | atom'''
    if len(p) == 2:
        p[0] = p[1]
    elif p[2] == "OR":
        p[0] = ["or", p[1], p[3]]
    elif p[2] == "AND":
        p[0] = ["and", p[1], p[3]]
    elif p[1] == "NOT":
        p[0] = ["not", p[1]]
    elif p[2] == "==":
        p[0] = ["equal", p[1], p[3]]
    elif p[2] == "IN":
        p[0] = ["in", p[1], p[3]]
    elif p[1] == "(" and p[3] == ")":
        p[0] = [[p[2]]]
    else:
        print("ERROR AT EXPR")

def p_atom(p):
    '''atom : NEWID
            | VOCAL
            | IPA
            | list'''
    p[0] = p[1]

def p_list(p):
    '''list : LBRACKET RBRACKET
            | LBRACKET atom list_tail'''
    if len(p) == 3:
        p[0] = ["list", []]
    else:
        p[0] = ["list", [p[2]] + p[3]]

def p_list_tail(p):
    '''list_tail : COMMA atom list_tail
                 | RBRACKET'''
    if len(p) == 4:
        p[0] = [p[2]] + p[3]
    elif len(p) == 2:
        p[0] = []
    else:
        print("ERROR AT LISTTAIL")

# def p_nested_if_in_else(p):
#     '''nested_if_in_else : IF LPAREN expr RPAREN stmt_block
#                          | ELSE IF LPAREN expr RPAREN stmt_block
#                          | elif_part else_part ENDIF'''

parser = yacc.yacc()


# -------------------------------
# 主程序：从键盘读取输入并输出语法树
# -------------------------------


def main():
    print("请输入您的程序（输入 EOF 结束，Linux/macOS: Ctrl+D, Windows: Ctrl+Z + Enter）:")
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except EOFError:
        pass

    data = "\n".join(lines)
    if data.strip() == "":
        print("输入为空。")
        return

    print("\n=> 正在解析...")
    result = parser.parse(data)
    if result is not None:
        print("\n=> 解析成功！语法树如下：\n")
        print(result)
    else:
        print("解析失败。")

if __name__ == "__main__":
    main()