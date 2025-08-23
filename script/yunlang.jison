%lex

%%

\s+                   /* skip whitespace */
"("                   return 'LPAREN';
")"                   return 'RPAREN';
"["                   return 'LBRACKET';
"]"                   return 'RBRACKET';
","                   return 'COMMA';
"=="                  return 'EQ';
"="                   return 'ASSIGN';

[a-zA-Z0-9\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFFɐ-ʯØθȿ]+  {
    const value = yytext;

    // 关键字映射
    const keywords = {
        "IF": ["IF", "如果", "要是"],
        "THEN": ["THEN", "则", "則", "那就", "就", "的話", "的话", "then"],
        "ELSE": ["ELSE", "否则", "否則"],
        "ENDIF": ["ENDIF", "结束如果", "結束如果"],
        "END": ["END", "结束", "結束"],
        "IN": ["IN", "在", "包含於", "包含于"],
        "AND": ["AND", "和", "且", "与", "與"],
        "OR": ["OR", "或"],
        "NOT": ["NOT", "非", "否"],
        "DEF": ["DEF", "定义", "定義"],
        "ELIF": ["ELIF", "再如果", "再如果的话", "elif"],
        "VOCAL": ["幫", "滂", "並", "明", "來", "端", "透", "定", "泥", "知", "徹", "澄", "娘", "精", "清", "從", "心", "邪", "莊", "初", "崇", "生", "俟", "章", "昌", "常", "書", "船", "日", "見", "溪", "群", "疑", "以", "影", "曉", "匣", "云"]
    };

    for (let token in keywords) {
        if (keywords[token].includes(value)) {
            return token;
        }
    }

    // IPA 判断
    if (/[ɐ-ʯØθȿ]+/.test(value)) {
        return 'IPA';
    }

    // 默认 NEWID
    return 'NEWID';
}


<<EOF>>               return 'EOF';
.                     return 'INVALID';  // 非法字符处理

/lex

%left ELSE ELIF
%left OR AND
%nonassoc EQ IN
%right NOT

%start program

%%

program
  : stmt_list EOF { $$ = $1; return($$)}
  ;

stmt_list
  : stmt_list statement { $$ = $1.concat([$2]); }
  |                     { $$ = []; }
  ;

statement
  : assignment
  | definition
  | conditional
  ;

assignment
  : VOCAL ASSIGN expr     { $$ = ["assign", $1, $3]; }
  | NEWID ASSIGN expr     { $$ = ["assign", $1, $3]; }
  ;

definition
  : DEF NEWID ASSIGN list   { $$ = ["definition", $2, $4]; }
  | DEF NEWID ASSIGN VOCAL  { $$ = ["definition", $2, $4]; }
  ;

conditional
  : IF LPAREN expr RPAREN THEN stmt_block ENDIF
    { $$ = ["if", $3, "then", $6]; }
  | IF LPAREN expr RPAREN THEN stmt_block ELSE stmt_block ENDIF
    { $$ = ["if", $3, "then", $6, "else", $8]; }
  ;

stmt_block
  : statement      { $$ = [$1]; }
  | stmt_list      { $$ = $1; }
  ;

expr
  : expr OR expr   { $$ = ["or", $1, $3]; }
  | expr AND expr  { $$ = ["and", $1, $3]; }
  | NOT expr       { $$ = ["not", $2]; }
  | atom EQ atom   { $$ = ["equal", $1, $3]; }
  | atom IN atom   { $$ = ["in", $1, $3]; }
  | LPAREN expr RPAREN { $$ = $2; }
  | atom           { $$ = $1; }
  ;

atom
  : NEWID
  | VOCAL
  | IPA
  | list
  ;

list
  : LBRACKET RBRACKET              { $$ = ["list", []]; }
  | LBRACKET atom list_tail        { $$ = ["list", [$2].concat($3)];}
  ;

list_tail
  : COMMA atom list_tail           { $$ = [$2,].concat($3);}
  | RBRACKET                       { $$ = []; }
  ;