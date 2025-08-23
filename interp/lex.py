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

# 需要将 EQ 的优先级提高，在 KANJI 之前处理
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


# --------------------- 主程序 ---------------------

def main():

    s = """
    DEF 輕唇十韻 = [虞, 鍾, 廢, 元, 陽, 文, 東, 微, 尤, 凡]

IF (
    韻 IN 輕唇十韻
    AND 等 EQ 三
    AND 口 EQ 合
) 
    幫 = f
ELSE 
    幫 = p
ENDIF

IF (
    韻 IN 輕唇十韻
    AND 等 EQ 三
    AND 口 EQ 合
) 
    並 = f
ELSE IF (
    聲 EQ 平
) 
    並 = ph
 
ELSE 
    並 = p

ENDIF

IF (
    韻 IN 輕唇十韻
    AND 等 EQ 三
    AND 口 EQ 合
) 
    滂 = f

ELSE 
    滂 = ph

ENDIF

IF (
    聲 EQ 平
    AND 平 = 陽
) 
    常 = tʃh

ELSE 
    常 = ʃ

ENDIF

IF (
    韻 IN [止, 脂, 之]
    AND 等 IN [三, 四]
    AND 口 EQ 開
) 
    日 = ɭ

ELSE 
    日 = Ø

ENDIF

IF (
    等 IN [三, 四]
) 
    見 = tɕ

ELSE IF (
    等 EQ 二
    AND 口 EQ 開
) 
    見 = tɕ

ELSE 
    見 = k

ENDIF

IF (
    等 IN [三, 四]
) 
    溪 = tɕh

ELSE 
    溪 = kh

ENDIF

IF (
    呼 IN [齊齒呼, 撮口呼]
    AND 等 IN [三, 四]
   ) 
    IF (
        聲 EQ 平
    ) 
        群 = tɕh
    
    ELSE 
        群 = tɕ
    
    ENDIF
ELSE IF (
    呼 IN [齊齒呼, 撮口呼]
    AND 等 IN [二]
    AND 口 EQ 開
   ) 
    IF (
        聲 EQ 平
    ) 
        群 = tɕh
    
    ELSE 
        群 = tɕ
    
    ENDIF
ELSE
    IF (
    聲 EQ 平
    ) 
        群 = kh
    
    ELSE 
        群 = k
    
    ENDIF
ENDIF

IF (
    聲 EQ 平
)  
    IF (
        呼 IN [齊齒呼, 撮口呼]
    ) 
        從 = tsh
    
    ELSE 
        從 = tsh
    
    ENDIF

ELSE
    IF (
        呼 IN [齊齒呼, 撮口呼]
    ) 
        從 = ts
    
    ELSE 
        從 = tθ
    
    ENDIF
ENDIF

IF (
    韻 IN 輕唇十韻
) 
    明 = u

ELSE 
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
以 = Ø"""
    # 给 lexer 提供输入
    lexer.input(s)

    # 输出所有 token
    print("Tokens:")
    has_tokens = False
    while True:
        tok = lexer.token()
        if not tok:
            break
        print(f"  type={tok.type}, value='{tok.value}', line={tok.lineno if hasattr(tok, 'lineno') else 1}, pos={tok.lexpos}")
        has_tokens = True
    if not has_tokens:
        print("  (未识别任何token)")
    print()

if __name__ == '__main__':
    main()