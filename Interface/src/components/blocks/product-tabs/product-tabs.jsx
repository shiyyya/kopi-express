import "./product-tabs.css";

function CategoryTabs({
    categories,
    selectedCategory,
    onSelect,
    className = "",
}) {
    return (
        <div className={`category-tabs ${className}`}>
            {categories.map((category) => (
                <button
                    key={category.name}
                    type="button"
                    className={`category-tab ${
                        selectedCategory === category.value ? "active" : ""
                    }`}
                    onClick={() => onSelect(category)}
                >
                    {category.icon && (
                        <category.icon className="category-tab-icon" />
                    )}
                    <span>{category.name}</span>
                </button>
            ))}
        </div>
    );
}

export default CategoryTabs;