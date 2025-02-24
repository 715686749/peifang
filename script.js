function calculateRecipe() {
    const totalGrams = parseFloat(document.getElementById('total-grams').value);
    const ingredientsText = document.getElementById('ingredients').value;

    // 使用更灵活的正则表达式提取食材、数量和单位
    const regex = /([\u4e00-\u9fa5a-zA-Z]+)\s*[:：]?\s*(?:\([^)]*\))?\s*([\d./-]+)\s*([\u4e00-\u9fa5a-zA-Z]*)/g;
    let match;
    const ingredientList = [];
    let totalOriginalQuantity = 0;

    // 打印调试信息
    console.log('输入文本:', ingredientsText);

    while ((match = regex.exec(ingredientsText)) !== null) {
        console.log('匹配到:', match[1], match[2], match[3]); // 打印食材名称、数量和单位
        const name = match[1].trim();
        let quantity = match[2];
        const unit = match[3] || ''; // 单位可以为空

        // 处理分数（如1/3）
        if (quantity.includes('/')) {
            const [numerator, denominator] = quantity.split('/').map(parseFloat);
            quantity = numerator / denominator;
        } else {
            quantity = parseFloat(quantity);
        }

        // 处理范围值（如1-30）
        if (typeof quantity === 'string' && quantity.includes('-')) {
            const [min, max] = quantity.split('-').map(parseFloat);
            quantity = (min + max) / 2; // 取中间值
        }

        // 累加总数量
        totalOriginalQuantity += quantity;

        // 保留食材信息
        ingredientList.push({ name, quantity, unit });
    }

    // 打印原始配方总克数
    console.log('原始配方总克数:', totalOriginalQuantity);

    if (totalOriginalQuantity === 0) {
        alert('未找到有效的配方信息，请检查输入格式');
        return;
    }

    // 计算调整比例
    const ratio = totalGrams / totalOriginalQuantity;
    console.log('调整比例:', ratio);

    const adjustedRecipe = ingredientList.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity * ratio, // 按比例调整数量
        unit: ingredient.unit // 保持单位不变
    }));

    // 显示结果
    const resultList = document.getElementById('adjusted-recipe');
    resultList.innerHTML = '';
    adjustedRecipe.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.name}: ${ingredient.quantity.toFixed(2)}${ingredient.unit}`;
        resultList.appendChild(li);
    });

    document.getElementById('result').classList.remove('hidden');
}