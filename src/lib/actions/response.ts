export interface ApiResponse<T = any> {
  success: boolean
  status: number
  message?: string
  data?: T
  error?: string
}

export function successResponse<T>(data: T, status: number = 200, message?: string): ApiResponse<T> {
  return {
    success: true,
    status,
    message,
    data,
  }
}

export function errorResponse(status: number, error: string, message?: string): ApiResponse {
  return {
    success: false,
    status,
    error,
    message: message || error,
  }
}

export function handleActionError(error: unknown): ApiResponse {
  if (error instanceof Error) {
    
    if (error.message.includes("Unauthorized") || error.message.includes("unauthorized")) {
      return errorResponse(401, error.message, "No autorizado")
    }

    
    if (error.message.includes("not found") || error.message.includes("No existe")) {
      return errorResponse(404, error.message, "No encontrado")
    }

    
    if (
      error.message.includes("Se requiere") ||
      error.message.includes("required") ||
      error.message.includes("invalid")
    ) {
      return errorResponse(400, error.message, "Solicitud inválida")
    }

  
    if (error.message.includes("already exists") || error.message.includes("ya existe")) {
      return errorResponse(409, error.message, "Conflicto")
    }

    
    return errorResponse(500, error.message, "Error interno del servidor")
  }

  return errorResponse(500, "Unknown error", "Error desconocido")
}
