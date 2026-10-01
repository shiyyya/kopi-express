import { Op } from "sequelize";
import { Staff, Order as OrderModel, OrderItem as OrderItemModel, Product as ProductModel, StoreBranch as StoreBranchModel } from "../models/index.js";
import { User } from "../models/User.js";

export async function getSalesReport(user: User, storeBranchId?: string, startDate?: string, endDate?: string) {
  let branchId = storeBranchId;
  if (user.role === "staff") {
    const staff = await Staff.findByPk(user.id);
    if (!staff) throw new Error("Staff account not found");
    branchId = staff.storeBranchId;
  }
  let branchName = null;
  if (branchId) {
    const branch = await StoreBranchModel.findByPk(branchId, { attributes: ["name"] });
    branchName = branch?.name ?? null;
  }
  const orders = await OrderModel.findAll({
    attributes: ["id", "storeBranchId", "fulfillmentType", "paymentMethod", "status", "createdAt"],
    where: {
      ...(branchId ? { storeBranchId: branchId } : {}),
      status: "completed",
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
          ...(endDate ? { [Op.lte]: new Date(`${endDate}T23:59:59.999`) } : {})
        }
      } : {})
    },
    include: [
      { model: StoreBranchModel, attributes: ["name"] },
      {
        model: OrderItemModel,
        attributes: ["quantity", "unitPrice"],
        include: [{ model: ProductModel, attributes: ["name"] }]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
  const data = orders.flatMap((order) => {
    const orderData = order.toJSON() as any;
    return orderData.OrderItems.map((item: any) => ({
      date: orderData.createdAt,
      orderId: orderData.id,
      branch: orderData.StoreBranch?.name ?? branchName,
      product: item.Product?.name ?? null,
      unitsSold: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalSale: Number(item.unitPrice) * item.quantity,
      paymentMethod: orderData.paymentMethod,
      orderType: orderData.fulfillmentType
    }));
  });
  return { data, branch: branchName };
}