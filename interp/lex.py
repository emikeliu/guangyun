# -*- encode
import re

import ply.lex as lex

tokens = (
    "NEWID",
    "IF",    # IF
    "THEN",    # THEN
    "ELSE",    # ELSE
    "END",    # END
    "ELIF",    # ELIF
    "ENDIF",    # EIF
    "LPAREN",    # (
    "RPAREN",    # )
    "IN",    # IN
    "QUOTE",    # "
    "AND",    # AND
    "OR",    # OR
    "EQ",    # EQ
    "ASSIGN",    # =
    "LBRACKET",    # [
    "RBRACKET",    # ]
    "COMMA",    # ,
    "DEF",    # DEF
    "VOCAL",    # 曉
    "ID",    # 輕唇十韻
    "SPACE",
    "IPA",
    "NEWLINE",
    "KANJI"
)
t_LPAREN = r"\("
t_RPAREN = r"\)"
t_QUOTE = r"\""
t_ASSIGN = r"="
t_LBRACKET = r"\["
t_RBRACKET = r"\]"
t_COMMA = r","


def t_NEWLINE(t):
    r'\n+'
    t.lexer.lineno += len(t.value)
    return t

def t_SPACE(t):
    r'\s+'
    return t

def t_KANJI(t):
    r'[a-zA-Z0-9\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFFɐ-ʯØθȿ]+'
    if t.value in "幫滂並明來端透定泥知徹澄娘精清從心邪莊初崇生俟章昌常書船日見溪群疑以影曉匣云":
        t.type="VOCAL"
    elif t.value in ["IF", "THEN", "ELSE", "EIF", "ELIF", "IN", "AND", "OR", "EQ", "DEF"]:
        t.type=t.value
    elif re.search(r"[ɐ-ʯØθȿ]+", t.value):
        t.type="IPA"
    else:
        t.type="NEWID"
    return t

def t_error(t):
    print("Illegal character '%s'" % t.value[0])
    t.lexer.skip(1)

lexer = lex.lex()

data = """
DEF 輕唇十韻 = [虞, 鍾, 廢, 元, 陽, 文, 東, 微, 尤, 凡]

IF (
    韻 IN 輕唇十韻
    AND 等 EQ 三
    AND 呼 EQ 合
) THEN
    幫 = f
ELSE
    幫 = p
END IF

IF (
    韻 IN 輕唇十韻
    AND 等 EQ 三
    AND 呼 EQ 合
) THEN
    並 = f
ELSE IF 聲 EQ 平 THEN
    並 = ph
ELSE
    並 = p
END IF

IF (
    韻 IN 輕唇十韻
    AND 等 EQ 三
    AND 呼 EQ 合
) THEN
    滂 = f
ELSE
    滂 = ph
END IF

IF (
    聲 EQ 平
) THEN
    常 = tʃh
ELSE
    常 = ʃ
END IF

IF (
    韻 IN [止, 脂, 之]
    AND 等 IN [三, 四]
    AND 呼 EQ 开
) THEN
    日 = ɭ
ELSE
    日 = Ø
END IF

IF (
    等 IN [三, 四]
) THEN
    見 = tɕ
ELSE
    見 = k
END IF

IF (
    等 IN [三, 四]
) THEN
    溪 = tɕh
ELSE
    溪 = kh
END IF

IF (
    四呼 IN [齊齒呼, 撮口呼]
    AND 等 IN [三, 四]
   ) THEN
    IF (
        聲 EQ 平
    ) THEN
        群 = tɕh
    ELSE
        群 = tɕ
    END IF
ELSE
    IF (
    聲 EQ 平
    ) THEN
        群 = kh
    ELSE
        群 = k
    END IF
END IF

IF (
    聲 EQ 平
) THEN 
    IF (
        四呼 IN [齊齒呼, 撮口呼]
    ) THEN
        從 = tsh
    ELSE
        從 = tsh
    END IF
ELSE
    IF (
        四呼 IN [齊齒呼, 撮口呼]
    ) THEN
        從 = ts
    ELSE
        從 = tθ
    END IF
END IF

明 = m
端 = t
透 = th
定 = th
泥 = n
精 = ts
見 = tɕ
來 = l
匣 = ɕ
書 = ʃ
章 = ʃ
生 = ȿ
心 = s
邪 = s
俟 = ʂ

昌 = tʃh
崇 = tʃh
徹 = tʃh
知 = tȿ
莊 = tȿh
初 = tʂh
章 = tʃ

曉 = ɕ
匣 = x
疑 = Ø
影 = Ø
以 = Ø
"""

lexer.input(data)
while True:
    tok = lexer.token()
    if not tok:
        break
    print(tok)