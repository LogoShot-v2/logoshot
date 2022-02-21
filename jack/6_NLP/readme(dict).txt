
	文本前處理(切詞與斷詞)

	目標:650000筆trademark的caseno

	文本內容:
		針對每個caseno，有以下的文字(僅中文)
		1. 商標名稱
		2. 商品描述(goods_denomination from rcc，占了大部分且長短不一)
		3. 商標擁有權人與地址(achinese and address from rco，已經去掉人名，包含公司名與地名)
		4. 圖樣上中文(chinese from text)
	將所有的文字串在一起，移除非中文的東西(包含符號也移除)，再丟入monpa切詞，再移除stopwords

	#加入空白再斷詞的地方

	自定義辭典:約150個未切好的詞

	疑問:文本中商品描述的量占了一大部分，且長短十分不一，不知道會不會影響搜尋結果?