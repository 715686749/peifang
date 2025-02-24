function calculateRecipe() {
    const totalGrams = parseFloat(document.getElementById('total-grams').value);
    const ingredientsText = document.getElementById('ingredients').value;

    // 定义单位转换表（用于计算总克数）
    const unitConversion = {
        '杯': 240,
        '根': 50,
        '片': 5,
        '顆': 5,
        'g': 1,
        '克': 1
    };

    // 使用正则表达式提取食材、数量和单位
    const regex = /([\u4e00-\u9fa5a-zA-Z]+)\s*(?:\([^)]*\))?\s*([\d./-]+)\s*([\u4e00-\u9fa5a-zA-Z]*)/g;
    let match;
    const ingredientList = [];
    let totalOriginalGrams = 0;

    while ((match = regex.exec(ingredientsText)) !== null) {
        const name = match[1].trim();
        let quantity = match[2];
        const unit = match[3] || '克'; // 默认单位为克

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

        // 转换单位并计算总克数
        const grams = quantity * (unitConversion[unit] || 1);
        totalOriginalGrams += grams;
        ingredientList.push({ name, quantity, unit }); // 保留原始单位和数量
    }

    if (totalOriginalGrams === 0) {
        alert('未找到有效的配方信息，请检查输入格式');
        return;
    }

    // 计算调整比例
    const ratio = totalGrams / totalOriginalGrams;
    const adjustedRecipe = ingredientList.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity * ratio, // 调整数量
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