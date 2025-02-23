function calculateRecipe() {
    const totalGrams = parseFloat(document.getElementById('total-grams').value);
    const ingredientsText = document.getElementById('ingredients').value;

    // 使用正则表达式提取食材和克数
    const regex = /([\u4e00-\u9fa5a-zA-Z]+)\s*([\d.-]+)\s*克/g;
    let match;
    const ingredientList = [];
    let totalOriginalGrams = 0;

    while ((match = regex.exec(ingredientsText)) !== null) {
        const name = match[1].trim();
        let grams = match[2];

        // 处理范围值（如1-30克）
        if (grams.includes('-')) {
            const [min, max] = grams.split('-').map(parseFloat);
            grams = (min + max) / 2; // 取中间值
        } else {
            grams = parseFloat(grams);
        }

        totalOriginalGrams += grams;
        ingredientList.push({ name, grams });
    }

    if (totalOriginalGrams === 0) {
        alert('未找到有效的配方信息，请检查输入格式');
        return;
    }

    // 计算调整比例
    const ratio = totalGrams / totalOriginalGrams;
    const adjustedRecipe = ingredientList.map(ingredient => ({
        name: ingredient.name,
        grams: ingredient.grams * ratio
    }));

    // 显示结果
    const resultList = document.getElementById('adjusted-recipe');
    resultList.innerHTML = '';
    adjustedRecipe.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.name}: ${ingredient.grams.toFixed(2)}克`;
        resultList.appendChild(li);
    });

    document.getElementById('result').classList.remove('hidden');
}