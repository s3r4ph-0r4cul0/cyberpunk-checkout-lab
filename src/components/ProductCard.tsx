import { ShoppingCart, Shield, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  onBuy: (id: number, price: number) => void;
  isVulnerable?: boolean;
}

export const ProductCard = ({
  id,
  name,
  price,
  description,
  imageUrl,
  onBuy,
  isVulnerable = false,
}: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  return (
    <div className={cn(
      "cyber-card rounded-sm p-6 transition-all duration-300 hover:scale-[1.02]",
      isVulnerable ? "neon-border-red" : "neon-border-green"
    )}>
      <div className="relative mb-4">
        <div className="aspect-square rounded-sm overflow-hidden border border-primary/20 bg-muted/20">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shield className={cn(
                "w-16 h-16",
                isVulnerable ? "text-destructive/50" : "text-primary/50"
              )} />
            </div>
          )}
        </div>
        {isVulnerable && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-destructive/90 rounded-sm">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-bold uppercase">Vulnerável</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs text-muted-foreground font-mono">ID: {id}</span>
          <h3 className="font-orbitron text-lg font-bold neon-text-green">
            {name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-primary/20">
          <div>
            <span className="text-xs text-muted-foreground">PREÇO</span>
            <p className={cn(
              "font-orbitron text-2xl font-bold",
              isVulnerable ? "neon-text-red" : "neon-text-green"
            )}>
              {formattedPrice}
            </p>
          </div>
          <Button
            variant={isVulnerable ? "danger" : "cyber"}
            size="lg"
            onClick={() => onBuy(id, price)}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
