function calculateRecipe() {
    const totalGrams = parseFloat(document.getElementById('total-grams').value);
    const ingredientsText = document.getElementById('ingredients').value;
    const ingredients = ingredientsText.split('\n').filter(line => line.trim() !== '');

    let totalOriginalGrams = 0;
    const ingredientList = [];

    ingredients.forEach(line => {
        // 使用正则表达式提取食材名称和数字
        const match = line.match(/([\u4e00-\u9fa5a-zA-Z]+)\s*([\d.]+)\s*(g|kg|ml)?/i);
        if (match) {
            const name = match[1].trim();
            let grams = parseFloat(match[2]);
            const unit = (match[3] || '').toLowerCase();

            // 转换单位
            if (unit === 'kg') {
                grams *= 1000; // 千克转克
            } else if (unit === 'ml') {
                // 假设1毫升 ≈ 1克（适用于水或类似密度的液体）
                grams *= 1;
            }

            totalOriginalGrams += grams;
            ingredientList.push({ name, grams });
        }
    });

    if (totalOriginalGrams === 0) {
        alert('请输入有效的配方');
        return;
    }

    const ratio = totalGrams / totalOriginalGrams;
    const adjustedRecipe = ingredientList.map(ingredient => ({
        name: ingredient.name,
        grams: ingredient.grams * ratio
    }));

    const resultList = document.getElementById('adjusted-recipe');
    resultList.innerHTML = '';
    adjustedRecipe.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.name}: ${ingredient.grams.toFixed(2)}克`;
        resultList.appendChild(li);
    });

    document.getElementById('result').classList.remove('hidden');
}