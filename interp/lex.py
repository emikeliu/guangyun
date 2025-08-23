# -*- encoding: utf-8 -*-
import re
import ply.lex as lex

tokens = (
    "NEWID",
    "IF",       # IF
    "THEN",     # THEN
    "ELSE",     # ELSE
    "ENDIF",    # ENDIF
    "END",      # END
    "LPAREN",   # (
    "RPAREN",   # )
    "IN",       # IN
    "AND",      # AND
    "OR",       # OR
    "EQ",       # EQ
    "ASSIGN",   # =
    "LBRACKET", # [
    "RBRACKET", # ]
    "COMMA",    # ,
    "DEF",      # DEF
    "VOCAL",    # 曉
    "IPA",
    "NOT",      # NOT
    "ELIF"      # 添加ELIF token
)

t_ignore = ' \t\n'
t_LPAREN = r"\("
t_RPAREN = r"\)"
t_LBRACKET = r"\["
t_RBRACKET = r"\]"
t_COMMA = r","

def t_EQ(t):
    r'=='
    return t

def t_ASSIGN(t):
    r'='
    return t

def t_KANJI(t):
    r'[a-zA-Z0-9\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFFɐ-ʯØθȿ]+'
    if t.value in "幫滂並明來端透定泥知徹澄娘精清從心邪莊初崇生俟章昌常書船日見溪群疑以影曉匣云":
        t.type = "VOCAL"
    elif t.value in ["IF", "THEN", "ELSE", "ENDIF", "IN", "AND", "OR", "DEF", "NOT", "ELIF", "END"]:  # 添加ELIF
        t.type = t.value
    elif t.value in ["如果", "要是"]:
        t.type = "IF"
        t.value = "IF"
    elif t.value in ["和", "且", "与", "與"]:
        t.type = "AND"
        t.value = "AND"
    elif t.value in ["或"]:
        t.type = "OR"
        t.value = "OR"
    elif t.value in ["非", "否"]:
        t.type = "NOT"
        t.value = "NOT"
    elif t.value in ["定义", "定義"]:
        t.type = "DEF"
        t.value = "DEF"
    elif t.value in ["在", "包含於", "包含于"]:
        t.type = "IN"
        t.value = "IN"
    elif t.value in ["结束", "結束"]:
        t.type = "END"
        t.value = "END"
    elif t.value in ["结束如果", "結束如果"]:
        t.type = "ENDIF"
        t.value = "ENDIF"
    elif t.value in ["则", "則", "那就", "就", "的話", "的话", "then"]:
        t.type = "THEN"
        t.value = "THEN"
    elif t.value in ["否则", "否則"]:
        t.type = "ELSE"
        t.value = "ELSE"
    elif t.value in ["再如果", "再如果的话", "elif"]:  # 添加ELIF的中文对应
        t.type = "ELIF"
        t.value = "ELIF"
    elif re.search(r"[ɐ-ʯØθȿ]+", t.value):
        t.type = "IPA"
    else:
        t.type = "NEWID"
    return t
def t_error(t):
    print("Illegal character '%s'" % t.value[0])
    t.lexer.skip(1)

lexer = lex.lex()