import IOrdersController, {
  ClientOrderDto,
  findOrdersRequest,
  CreateOrderByClientRequest,
  CreateOrderByAdminRequest,
  UpdateOrderByAdminRequest,
  CreateProductRequest,
  UpdateProductRequest,
} from "../abstractions/IOrderController";
import {  supabaseAdmin } from "../../lib/supabase/server";

import { randomUUID } from "crypto";
import { Result } from "../shared/Result";
import { ProductModel } from "../models/ProductModel";
import { OrderModel } from "../models/OrderModel";

export const SupabaseOrdersController: IOrdersController = {
  getClientOrderById: async (orderId: string): Promise<Result<ClientOrderDto>> => {
    try {
      const { data, error } = await supabaseAdmin().from("orders").select("*").eq("id", orderId).maybeSingle();
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      if (!data) return Result.err({ code: "NOT_FOUND", message: "Pedido no encontrado" });

      const dto = {
        id: data.id,
        clientId: data.client_id,
        status: data.status as any,
        packagePrice: Number(data.package_cost ?? 0),
        deliveryPrice: Number(data.shipping_cost ?? 0),
        spentMoney: Number(data.invested_amount ?? 0),
        moneyPaidByClient: Number(data.paid_amount ?? 0),
        shopCartUrl: "",
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.created_at),
      } as unknown as ClientOrderDto;

      return Result.ok(dto);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  getClientAllOrders: async (): Promise<Result<ClientOrderDto[]>> => {
    try {
      const { data: userData } = await supabaseAdmin().auth.getUser();
      if (!userData.user) return Result.err({ code: "UNAUTHORIZED", message: "Usuario no autenticado" });

      const { data, error } = await supabaseAdmin().from("orders").select("*").eq("client_id", userData.user.id);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });

      const dtos = (data ?? []).map((d: any) => ({
        id: d.id,
        clientId: d.client_id,
        status: d.status as any,
        packagePrice: Number(d.package_cost ?? 0),
        deliveryPrice: Number(d.shipping_cost ?? 0),
        spentMoney: Number(d.invested_amount ?? 0),
        moneyPaidByClient: Number(d.paid_amount ?? 0),
        shopCartUrl: "",
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.created_at),
      } as unknown as ClientOrderDto));

      return Result.ok(dtos);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  getClientOrderProducts: async (orderId: string): Promise<Result<ProductModel[]>> => {
    try {
      const { data, error } = await supabaseAdmin().from("products").select("*").eq("order_id", orderId);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      if (!data) return Result.err({ code: "NOT_FOUND", message: "Productos no encontrados" });

      const prods = (data ?? []).map((p: any) => ({
        id: p.id,
        orderId: p.order_id,
        idFromShop: p.store_order_id,
        name: p.name,
        url: p.url,
        trackingNumber: p.tracking_number ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      return Result.ok(prods);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  findOrders: async (req: findOrdersRequest): Promise<Result<OrderModel[]>> => {
    try {
    
      let query = supabaseAdmin().from("orders").select("*");
      

      if (req.clientName) {
        
        const { data: ordersData, error } = await query;
        if (error) return Result.err({ code: "DB_ERROR", message: error.message });
        let filtered = (ordersData ?? []) as any[];
        
        if (req.trackingNumber) {
          const { data: productsData } = await supabaseAdmin().from("products").select("order_id").ilike("tracking_number", `%${req.trackingNumber}%`);
          const orderIds = (productsData ?? []).map((p: any) => p.order_id);
          filtered = filtered.filter((o) => orderIds.includes(o.id));
        }
        if (req.clientName) {
          
          const { data: profilesData } = await supabaseAdmin().from("profiles").select("id,full_name").ilike("full_name", `%${req.clientName}%`);
          const ids = (profilesData ?? []).map((p: any) => p.id);
          filtered = filtered.filter((o) => ids.includes(o.client_id));
        }

      
        if (req.ignoreCancelled) filtered = filtered.filter((o) => o.status !== "cancelled");
        if (req.ignoreDelievered) filtered = filtered.filter((o) => o.status !== "delivered");

        const dtos = filtered.map((d) => ({
          id: d.id,
          clientId: d.client_id,
          status: d.status as any,
          packagePrice: Number(d.package_cost ?? 0),
          deliveryPrice: Number(d.shipping_cost ?? 0),
          spentMoney: Number(d.invested_amount ?? 0),
          moneyPaidByClient: Number(d.paid_amount ?? 0),
          shopCartUrl: "",
          createdAt: new Date(d.created_at),
          updatedAt: new Date(d.created_at),
        } ))

        return Result.ok(dtos);
      }

     
      const { data, error } = await query;
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      const filtered = (data ?? []).filter((o: any) => {
        if (req.ignoreCancelled && o.status === "cancelled") return false;
        if (req.ignoreDelievered && o.status === "delivered") return false;
        return true;
      });

      const dto = (filtered.map((d: any) => ({
        id: d.id,
        clientId: d.client_id,
        status: d.status as any,
        packagePrice: Number(d.package_cost ?? 0),
        deliveryPrice: Number(d.shipping_cost ?? 0),
        spentMoney: Number(d.invested_amount ?? 0),
        moneyPaidByClient: Number(d.paid_amount ?? 0),
        shopCartUrl: "",
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.created_at),
      } )));

      return Result.ok(dto);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  createOrderByClient: async (req: CreateOrderByClientRequest): Promise<Result<void>> => {
    try {
      const { data } = await supabaseAdmin().auth.getUser();
      if (!data.user) return Result.err({ code: "UNAUTHORIZED", message: "Usuario no autenticado" });

      const orderId = randomUUID();
      const { error } = await supabaseAdmin().from("orders").insert([{ id: orderId, client_id: data.user.id, status: "revision pendiente" }]);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  createOrderByAdmin: async (req: CreateOrderByAdminRequest): Promise<Result<{ id: string }>> => {
    try {
      const id = randomUUID();
      const { error, data } = await supabaseAdmin().from("orders").insert([{ id, client_id: req.clientId, status: req.status as any, package_cost: (req.packagePrice ?? 0).toString(), shipping_cost: (req.deliveryPrice ?? 0).toString() }]);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      return Result.ok({ id });
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  updateOrderByAdmin: async (req: UpdateOrderByAdminRequest): Promise<Result<void>> => {
    try {
      const updateObj: any = {};
      if (req.status !== undefined) updateObj.status = req.status as any;
      if (req.packagePrice !== undefined) updateObj.package_cost = req.packagePrice.toString();
      if (req.deliveryPrice !== undefined) updateObj.shipping_cost = req.deliveryPrice.toString();
      if (req.spentMoney !== undefined) updateObj.invested_amount = req.spentMoney.toString();
      if (req.paidByClient !== undefined) updateObj.paid_amount = req.paidByClient.toString();

      const { error } = await supabaseAdmin().from("orders").update(updateObj).eq("id", req.orderId);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  createProductByAdmin: async (req: CreateProductRequest): Promise<Result<void>> => {
    try {
      const { error } = await supabaseAdmin().from("products").insert([{ id: randomUUID(), order_id: req.orderId, store_order_id: req.idFromShop, url: req.url, name: req.name, tracking_number: req.trackingNumber }]);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  updateProductByAdmin: async (req: UpdateProductRequest): Promise<Result<void>> => {
    try {
      const updateObj: any = {};
      if (req.trackingNumber !== undefined) updateObj.tracking_number = req.trackingNumber;
      if (req.name !== undefined) updateObj.name = req.name;
      if (req.idFromShop !== undefined) updateObj.store_order_id = req.idFromShop;
      if (req.url !== undefined) updateObj.url = req.url;

      const { error } = await supabaseAdmin().from("products").update(updateObj).eq("id", req.id);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },

  deleteProductByAdmin: async (id: string): Promise<Result<void>> => {
    try {
      const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
      if (error) return Result.err({ code: "DB_ERROR", message: error.message });
      return Result.ok(undefined);
    } catch (error) {
      return Result.err({ code: "UNKNOWN_ERROR", message: "Ocurrió un error inesperado" });
    }
  },
};
