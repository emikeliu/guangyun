const defaultValue = `定義 輕唇十韻 = [虞, 鍾, 廢, 元, 陽, 文, 東, 微, 尤, 凡]

如果 (
    韻 包含于 輕唇十韻
    且 等 == 三
    且 口 == 合
) THEN
    幫 = f
ELSE
    幫 = p
結束如果

如果 (
    韻 包含于 輕唇十韻
    且 等 == 三
    且 口 == 合
) THEN
    並 = f
ELSE 如果 (
        聲 == 平
    ) THEN
        並 = ph
    ELSE
        並 = p
    結束如果
結束如果

如果 (
    韻 包含于 輕唇十韻
    且 等 == 三
    且 口 == 合
) THEN
    滂 = f
ELSE
    滂 = ph
結束如果

如果 (
    聲 == 平
    且 平 == 陽
) THEN
    常 = tʃh
ELSE
    常 = ʃ
結束如果

如果 (
    韻 包含于 [止, 脂, 之]
    且 等 包含于 [三, 四]
    且 口 == 開
) THEN
    日 = ɭ
ELSE
    日 = Ø
結束如果

如果 (
    等 包含于 [三, 四]
) THEN
    見 = tɕ
ELSE 如果 (
        等 == 二
        且 口 == 開
    ) THEN
        見 = tɕ
    ELSE
        見 = k
    結束如果
結束如果

如果 (
    等 包含于 [三, 四]
) THEN
    溪 = tɕh
ELSE
    溪 = kh
結束如果

如果 (
    呼 包含于 [齊齒呼, 撮口呼]
    且 等 包含于 [三, 四]
   ) THEN
    如果 (
        聲 == 平
    ) THEN
        群 = tɕh
    ELSE
        群 = tɕ
    結束如果
ELSE 如果 (
    呼 包含于 [齊齒呼, 撮口呼]
    且 等 包含于 [二]
    且 口 == 開
   ) THEN
        如果 (
            聲 == 平
        ) THEN
            群 = tɕh
        ELSE
            群 = tɕ
        結束如果
    ELSE
        如果 (
        聲 == 平
        ) THEN
            群 = kh
        ELSE
            群 = k
        結束如果
    結束如果
結束如果

如果 (
    聲 == 平
) THEN
    如果 (
        呼 包含于 [齊齒呼, 撮口呼]
    ) THEN
        從 = tsh
    ELSE
        從 = tsh
    結束如果
ELSE
    如果 (
        呼 包含于 [齊齒呼, 撮口呼]
    ) THEN
        從 = ts
    ELSE
        從 = tθ
    結束如果
結束如果

如果 (
    韻 包含于 輕唇十韻
) THEN
    明 = u
ELSE
    明 = m
結束如果

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
`


window.onload = ()=>{
    document.getElementById("code").value = defaultValue;
    document.getElementById("explain").addEventListener("click", (e)=>{
        document.getElementById("tree").innerHTML = JSON.stringify(yunlang.parse(document.getElementById("code").value))

    })
}