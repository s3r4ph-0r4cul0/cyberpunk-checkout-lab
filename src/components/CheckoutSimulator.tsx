import { useState } from "react";
import { ShoppingCart, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { TerminalWindow } from "./TerminalWindow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CheckoutSimulatorProps {
  productId: number;
  productName: string;
  originalPrice: number;
}

export const CheckoutSimulator = ({ 
  productId, 
  productName, 
  originalPrice 
}: CheckoutSimulatorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    paid: number;
    message: string;
  } | null>(null);
  const [requestLog, setRequestLog] = useState<string[]>([]);

  const simulateCheckout = async (manipulatedPrice?: number) => {
    const priceToSend = manipulatedPrice ?? originalPrice;
    setIsProcessing(true);
    setResult(null);
    setRequestLog([]);

    // Simulate request logging
    const logs: string[] = [];
    
    logs.push(`[${new Date().toLocaleTimeString()}] Iniciando checkout...`);
    setRequestLog([...logs]);
    await new Promise(r => setTimeout(r, 300));

    logs.push(`>>> POST /api/checkout`);
    logs.push(`>>> Content-Type: application/json`);
    logs.push(`>>> Body: {"product_id": ${productId}, "price": ${priceToSend.toFixed(2)}}`);
    setRequestLog([...logs]);
    await new Promise(r => setTimeout(r, 500));

    // Simulate server response (always accepts client price - vulnerable!)
    const response = {
      status: "success",
      message: "Compra realizada!",
      product: productName,
      paid: priceToSend,
      real_price: originalPrice
    };

    logs.push(`<<< HTTP/1.1 200 OK`);
    logs.push(`<<< ${JSON.stringify(response)}`);
    setRequestLog([...logs]);

    await new Promise(r => setTimeout(r, 300));

    setResult({
      success: true,
      paid: priceToSend,
      message: manipulatedPrice 
        ? `💀 Preço manipulado aceito! Você pagou R$ ${priceToSend.toFixed(2)} ao invés de R$ ${originalPrice.toFixed(2)}`
        : `Compra legítima realizada por R$ ${priceToSend.toFixed(2)}`
    });

    if (manipulatedPrice) {
      toast.error("Vulnerabilidade Explorada!", {
        description: `Backend aceitou preço de R$ ${priceToSend.toFixed(2)}`,
      });
    } else {
      toast.success("Compra Realizada!", {
        description: `Pagamento de R$ ${priceToSend.toFixed(2)} processado`,
      });
    }

    setIsProcessing(false);
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="cyber-card rounded-sm p-4 space-y-3 neon-border-green">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h4 className="font-orbitron font-bold text-sm">Fluxo Legítimo</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Envia o preço correto do produto
          </p>
          <Button
            variant="cyber"
            className="w-full"
            onClick={() => simulateCheckout()}
            disabled={isProcessing}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar por {formatPrice(originalPrice)}</span>
          </Button>
        </div>

        <div className="cyber-card rounded-sm p-4 space-y-3 neon-border-red">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h4 className="font-orbitron font-bold text-sm">Ataque Manual</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Envia preço manipulado de R$ 0.01
          </p>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => simulateCheckout(0.01)}
            disabled={isProcessing}
          >
            <Send className="w-4 h-4" />
            <span>Comprar por {formatPrice(0.01)}</span>
          </Button>
        </div>
      </div>

      {/* Request Log */}
      {requestLog.length > 0 && (
        <TerminalWindow 
          title="network_log.txt" 
          variant={result?.paid !== originalPrice ? "red" : "green"}
        >
          <div className="space-y-1 min-h-[120px]">
            {requestLog.map((log, i) => (
              <div 
                key={i} 
                className={cn(
                  "animate-fade-in-up",
                  log.startsWith(">>>") && "text-yellow-400",
                  log.startsWith("<<<") && "text-blue-400"
                )}
              >
                {log}
              </div>
            ))}
            {isProcessing && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
            )}
          </div>
        </TerminalWindow>
      )}

      {/* Result */}
      {result && (
        <div className={cn(
          "p-4 rounded-sm border-2 animate-fade-in-up",
          result.paid !== originalPrice 
            ? "border-destructive bg-destructive/10" 
            : "border-primary bg-primary/10"
        )}>
          <div className="flex items-center gap-3">
            {result.paid !== originalPrice ? (
              <AlertTriangle className="w-6 h-6 text-destructive" />
            ) : (
              <CheckCircle className="w-6 h-6 text-primary" />
            )}
            <div>
              <h4 className={cn(
                "font-orbitron font-bold",
                result.paid !== originalPrice ? "text-destructive" : "text-primary"
              )}>
                {result.paid !== originalPrice ? "Ataque Bem Sucedido!" : "Transação Legítima"}
              </h4>
              <p className="text-sm text-muted-foreground">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
