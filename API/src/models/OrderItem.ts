import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize,
} from 'sequelize'; 

import { generateID } from '../utils/idGenerator.js';
import { Product } from './Product.js';
import { OrderItemAddOn } from './OrderItemAddOn.js';
import { PRODUCT_TEMPERATURE, ProductTemperature } from '../constants/cart.js';
import { CATEGORY, Category } from '../constants/product.js';

export class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
    declare id: CreationOptional<string>;
    declare orderId: string;
    declare productId: string;
    declare productCategory: Category;
    declare quantity: number;
    declare unitPrice: number;
    declare productTemp: ProductTemperature | null;
    declare Product?: NonAttribute<Product>;
    declare OrderItemAddOns?: NonAttribute<OrderItemAddOn[]>;
}

export function initOrderItem(sequelize: Sequelize): typeof OrderItem {
    OrderItem.init(
        {
            id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
            orderId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'orders', key: 'id' }, field: 'order_id' },
            productId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'products', key: 'id' }, field: 'product_id' },
            productCategory: { type: DataTypes.ENUM(...CATEGORY), allowNull: false, field: 'product_category' },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            unitPrice: { type: DataTypes.DECIMAL(8, 2), allowNull: false, field: 'unit_price' },
            productTemp: { type: DataTypes.ENUM(...PRODUCT_TEMPERATURE), allowNull: true, field: 'product_temperature' }
        },
        { sequelize, tableName: 'order_items', modelName: 'OrderItem', underscored: true, timestamps: false },
    );
    return OrderItem;
}