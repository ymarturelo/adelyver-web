import IOrdersController, {
  ClientOrderDto,
  findOrdersRequest,
  CreateOrderByClientRequest,
  CreateOrderByAdminRequest,
  UpdateOrderByAdminRequest,
  CreateProductRequest,
  UpdateProductRequest,
} from "../abstractions/IOrderController";
import { supabase, supabaseAdmin } from "@/lib/supabase/server";

import { randomUUID } from "crypto";
import { successResponse, errorResponse, handleActionError, type ApiResponse } from "@/lib/actions/response";

export const SupabaseOrdersController: IOrdersController = {
  getClientOrderById: async (orderId: string): Promise<ApiResponse<ClientOrderDto>> => {
    try {
      const { data, error } = await supabaseAdmin().from("orders").select("*").eq("id", orderId).maybeSingle();
      if (error) return errorResponse(400, error.message, "Error al obtener pedido");
      if (!data) return errorResponse(404, "Pedido no encontrado", "No existe el pedido");

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

      return successResponse(dto, 200, "Pedido obtenido exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  getClientAllOrders: async (): Promise<ApiResponse<ClientOrderDto[]>> => {
    try {
      const { data: userData } = await supabaseAdmin().auth.getUser();
      if (!userData.user) return errorResponse(401, "Usuario no autenticado", "Autenticación requerida");

      const { data, error } = await supabaseAdmin().from("orders").select("*").eq("client_id", userData.user.id);
      if (error) return errorResponse(400, error.message, "Error al obtener pedidos");

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

      return successResponse(dtos, 200, "Pedidos obtenidos exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  getClientOrderProducts: async (orderId: string): Promise<ApiResponse<any[]>> => {
    try {
      const { data, error } = await supabaseAdmin().from("products").select("*").eq("order_id", orderId);
      if (error) return errorResponse(400, error.message, "Error al obtener productos");

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

      return successResponse(prods, 200, "Productos obtenidos exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  findOrders: async (req: findOrdersRequest): Promise<ApiResponse<any[]>> => {
    try {
    
      let query = supabase().from("orders").select("*");

      if (req.clientName) {
        
        const { data: ordersData, error } = await query;
        if (error) return errorResponse(400, error.message, "Error al buscar pedidos");
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

        return successResponse(filtered.map((d) => ({
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
        } as unknown as any)), 200, "Pedidos encontrados exitosamente");
      }

     
      const { data, error } = await query;
      if (error) return errorResponse(400, error.message, "Error al buscar pedidos");
      const filtered = (data ?? []).filter((o: any) => {
        if (req.ignoreCancelled && o.status === "cancelled") return false;
        if (req.ignoreDelievered && o.status === "delivered") return false;
        return true;
      });

      return successResponse(filtered.map((d: any) => ({
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
      } as unknown as any)), 200, "Pedidos encontrados exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  createOrderByClient: async (req: CreateOrderByClientRequest): Promise<ApiResponse<void>> => {
    try {
      const { data } = await supabaseAdmin().auth.getUser();
      if (!data.user) return errorResponse(401, "Usuario no autenticado", "Autenticación requerida");

      const orderId = randomUUID();
      const { error } = await supabaseAdmin().from("orders").insert([{ id: orderId, client_id: data.user.id, status: "revision pendiente" }]);
      if (error) return errorResponse(400, error.message, "Error al crear pedido");
      return successResponse(undefined, 201, "Pedido creado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  createOrderByAdmin: async (req: CreateOrderByAdminRequest): Promise<ApiResponse<{ id: string }>> => {
    try {
      const id = randomUUID();
      const { error, data } = await supabaseAdmin().from("orders").insert([{ id, client_id: req.clientId, status: req.status as any, package_cost: (req.packagePrice ?? 0).toString(), shipping_cost: (req.deliveryPrice ?? 0).toString() }]);
      if (error) return errorResponse(400, error.message, "Error al crear pedido");
      return successResponse({ id }, 201, "Pedido creado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  updateOrderByAdmin: async (req: UpdateOrderByAdminRequest): Promise<ApiResponse<void>> => {
    try {
      const updateObj: any = {};
      if (req.status !== undefined) updateObj.status = req.status as any;
      if (req.packagePrice !== undefined) updateObj.package_cost = req.packagePrice.toString();
      if (req.deliveryPrice !== undefined) updateObj.shipping_cost = req.deliveryPrice.toString();
      if (req.spentMoney !== undefined) updateObj.invested_amount = req.spentMoney.toString();
      if (req.paidByClient !== undefined) updateObj.paid_amount = req.paidByClient.toString();

      const { error } = await supabaseAdmin().from("orders").update(updateObj).eq("id", req.orderId);
      if (error) return errorResponse(400, error.message, "Error al actualizar pedido");

      return successResponse(undefined, 200, "Pedido actualizado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  createProductByAdmin: async (req: CreateProductRequest): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabaseAdmin().from("products").insert([{ id: randomUUID(), order_id: req.orderId, store_order_id: req.idFromShop, url: req.url, name: req.name, tracking_number: req.trackingNumber }]);
      if (error) return errorResponse(400, error.message, "Error al crear producto");
      return successResponse(undefined, 201, "Producto creado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  updateProductByAdmin: async (req: UpdateProductRequest): Promise<ApiResponse<void>> => {
    try {
      const updateObj: any = {};
      if (req.trackingNumber !== undefined) updateObj.tracking_number = req.trackingNumber;
      if (req.name !== undefined) updateObj.name = req.name;
      if (req.idFromShop !== undefined) updateObj.store_order_id = req.idFromShop;
      if (req.url !== undefined) updateObj.url = req.url;

      const { error } = await supabaseAdmin().from("products").update(updateObj).eq("id", req.id);
      if (error) return errorResponse(400, error.message, "Error al actualizar producto");
      return successResponse(undefined, 200, "Producto actualizado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },

  deleteProductByAdmin: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
      if (error) return errorResponse(400, error.message, "Error al eliminar producto");
      return successResponse(undefined, 200, "Producto eliminado exitosamente");
    } catch (error) {
      return handleActionError(error);
    }
  },
};
