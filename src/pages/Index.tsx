import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CheckoutSimulator } from "@/components/CheckoutSimulator";
import { AttackDemo } from "@/components/AttackDemo";
import { LabFiles } from "@/components/LabFiles";
import { VulnerabilityInfo } from "@/components/VulnerabilityInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Skull, FileCode, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";

const PRODUCT = {
  id: 101,
  name: "Implante Neural X9",
  price: 500.00,
  description: "Chip de interface neural de última geração. Permite conexão direta com a rede, aumento de reflexos e armazenamento de memória expandido. Instalação não inclusa.",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("demo");

  const handleBuy = (id: number, price: number) => {
    toast.info("Checkout Iniciado", {
      description: `Produto #${id} - R$ ${price.toFixed(2)}`,
    });
    setActiveTab("demo");
  };

  return (
    <div className="min-h-screen bg-cyber-gradient bg-grid-pattern">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Intro Section */}
        <section className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/50 bg-destructive/10 text-destructive text-sm font-mono">
            <Skull className="w-4 h-4" />
            <span>AMBIENTE DE TREINAMENTO OFENSIVO</span>
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-black">
            <span className="neon-text-green">Manipulação de Preço</span>
            <br />
            <span className="text-muted-foreground text-xl md:text-2xl font-normal">
              Business Logic Abuse em APIs de Pagamento
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Este laboratório demonstra como atacantes exploram a confiança excessiva 
            do backend nos dados enviados pelo cliente para manipular transações financeiras.
          </p>
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Card */}
          <div className="lg:col-span-1">
            <ProductCard
              {...PRODUCT}
              onBuy={handleBuy}
              isVulnerable
            />
          </div>

          {/* Interactive Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-muted/30 border border-primary/20">
                <TabsTrigger 
                  value="demo" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Checkout</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="attack"
                  className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive gap-2"
                >
                  <Skull className="w-4 h-4" />
                  <span className="hidden sm:inline">Ataque</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="files"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
                >
                  <FileCode className="w-4 h-4" />
                  <span className="hidden sm:inline">Arquivos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="info"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Info</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="demo" className="space-y-4 animate-fade-in-up">
                <div className="cyber-card rounded-sm p-6">
                  <h3 className="font-orbitron text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Simulador de Checkout
                  </h3>
                  <CheckoutSimulator
                    productId={PRODUCT.id}
                    productName={PRODUCT.name}
                    originalPrice={PRODUCT.price}
                  />
                </div>
              </TabsContent>

              <TabsContent value="attack" className="animate-fade-in-up">
                <div className="cyber-card rounded-sm p-6">
                  <h3 className="font-orbitron text-lg font-bold text-destructive mb-4 flex items-center gap-2">
                    <Skull className="w-5 h-5" />
                    Demonstração de Ataque Automatizado
                  </h3>
                  <AttackDemo />
                </div>
              </TabsContent>

              <TabsContent value="files" className="animate-fade-in-up">
                <div className="cyber-card rounded-sm p-6">
                  <LabFiles />
                </div>
              </TabsContent>

              <TabsContent value="info" className="animate-fade-in-up">
                <VulnerabilityInfo />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-primary/20">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">[</span>
            SECURITY_LAB v1.0
            <span className="text-primary">]</span>
            {" // "}
            <span className="text-destructive">EDUCATIONAL PURPOSES ONLY</span>
            {" // "}
            <span className="text-primary">OWASP API Security</span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
