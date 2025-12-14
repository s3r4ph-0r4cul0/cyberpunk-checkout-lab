import { useState } from "react";
import { Play, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { TerminalWindow } from "./TerminalWindow";
import { cn } from "@/lib/utils";

interface AttackStep {
  text: string;
  type: "info" | "request" | "response" | "success" | "warning";
  delay: number;
}

const attackSteps: AttackStep[] = [
  { text: "[*] Iniciando ataque de manipulação de preço...", type: "info", delay: 500 },
  { text: "[*] Alvo: /api/checkout", type: "info", delay: 300 },
  { text: "[*] Obtendo informações do produto...", type: "info", delay: 400 },
  { text: ">>> GET /api/product/101", type: "request", delay: 600 },
  { text: '<<< {"id": 101, "name": "Implante Neural X9", "price": 500.00}', type: "response", delay: 500 },
  { text: "[!] Preço original detectado: R$ 500.00", type: "warning", delay: 400 },
  { text: "[*] Interceptando requisição de checkout...", type: "info", delay: 500 },
  { text: "[*] Modificando payload...", type: "info", delay: 400 },
  { text: "[!] Alterando price: 500.00 → 0.01", type: "warning", delay: 600 },
  { text: '>>> POST /api/checkout {"product_id": 101, "price": 0.01}', type: "request", delay: 700 },
  { text: '<<< {"status": "success", "message": "Compra realizada!", "paid": 0.01}', type: "response", delay: 500 },
  { text: "[✓] ATAQUE BEM SUCEDIDO!", type: "success", delay: 300 },
  { text: "[✓] Produto de R$ 500.00 comprado por R$ 0.01", type: "success", delay: 400 },
];

export const AttackDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState<AttackStep[]>([]);

  const runAttack = async () => {
    setIsRunning(true);
    setLogs([]);
    setCurrentStep(-1);

    for (let i = 0; i < attackSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, attackSteps[i].delay));
      setCurrentStep(i);
      setLogs(prev => [...prev, attackSteps[i]]);
    }

    setIsRunning(false);
  };

  const reset = () => {
    setLogs([]);
    setCurrentStep(-1);
  };

  const getLineColor = (type: AttackStep["type"]) => {
    switch (type) {
      case "request": return "text-yellow-400";
      case "response": return "text-blue-400";
      case "success": return "text-primary";
      case "warning": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="danger"
          size="lg"
          onClick={runAttack}
          disabled={isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Executando...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Executar Ataque</span>
            </>
          )}
        </Button>
        {logs.length > 0 && !isRunning && (
          <Button variant="ghost" onClick={reset}>
            Limpar
          </Button>
        )}
      </div>

      <TerminalWindow title="attack_simulation.py" variant="red">
        <div className="min-h-[300px] space-y-1">
          {logs.length === 0 && !isRunning && (
            <div className="text-muted-foreground/50 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Clique em "Executar Ataque" para iniciar a demonstração</span>
            </div>
          )}
          {logs.map((log, i) => (
            <div
              key={i}
              className={cn(
                "animate-fade-in-up",
                getLineColor(log.type)
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {log.text}
            </div>
          ))}
          {isRunning && (
            <span className="inline-block w-2 h-4 bg-destructive animate-pulse" />
          )}
        </div>
      </TerminalWindow>

      {logs.some(l => l.type === "success") && (
        <div className="p-4 rounded-sm border-2 border-primary bg-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary" />
            <div>
              <h4 className="font-orbitron font-bold text-primary">Vulnerabilidade Explorada</h4>
              <p className="text-sm text-muted-foreground">
                O backend confiou no preço enviado pelo cliente sem validação.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
