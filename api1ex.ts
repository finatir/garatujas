import todo from "./core.ts"; // importa sistema de tarefas
import path from "path"; // importa utilitário de caminhos

const PUBLIC_DIR = "./public"; // pasta pública dos arquivos estáticos

const server = Bun.serve({
  port: 3000, // porta do servidor

  routes: {

    "/api/todo": { // rota principal da api todo

      GET: async () => { // pega todos os itens
        const items = await todo.getItems(); // busca itens
        return Response.json(items); // retorna json
      },

      POST: async (req) => { // adiciona item
        const data = await req.json() as any; // pega body da requisição
        const item = data.item || null; // pega item enviado

        if (!item) { // verifica se veio item
          return Response.json(
            "Por favor, forneça um item para adicionar.",
            { status: 400 } // retorna erro
          );
        }

        await todo.addItem(item); // adiciona item

        return Response.json(data); // retorna dados enviados
      },
    },

    "/api/todo/:index": { // rota usando índice

      PUT: async (req) => { // atualiza item
        const index = parseInt(req.params.index); // pega índice da url

        if (isNaN(index)) { // verifica se é número
          return Response.json(
            "Índice inválido. um número inteiro é esperado.",
            { status: 400 } // retorna erro
          );
        }

        const data = await req.json() as any; // pega body
        const newItem = data.newItem || null; // pega novo item

        if (!newItem) { // verifica se veio item novo
          return Response.json(
            "Por favor, forneça um novo item para atualizar.",
            { status: 400 } // retorna erro
          );
        }

        try {
          await todo.updateItem(index, newItem); // atualiza item

          return Response.json(
            `Item no índice ${index} atualizado para "${newItem}".`
          ); // retorna sucesso

        } catch (error: any) {

          return Response.json(
            error.message,
            { status: 400 } // retorna erro
          );
        }
      },

      DELETE: async (req) => { // remove item
        const index = parseInt(req.params.index); // pega índice

        if (isNaN(index)) { // verifica se índice é válido
          return Response.json(
            "Índice inválido.",
            { status: 400 } // erro
          );
        }

        try {
          await todo.removeItem(index); // remove item

          return Response.json(
            `Item no índice ${index} removido com sucesso.`
          ); // retorna sucesso

        } catch (error: any) {

          return Response.json(
            error.message,
            { status: 400 } // retorna erro
          );
        }
      },
    },
  },

  async fetch(req) { // fallback para arquivos estáticos
    const url = new URL(req.url); // pega url da requisição

    const path =
      (url.pathname === "/") // verifica se é rota principal
        ? `./public/index.html` // carrega index
        : `./public${url.pathname}`; // carrega arquivo da pasta public

    const file = Bun.file(path); // pega arquivo

    if (await file.exists()) { // verifica se arquivo existe

      const headers = new Headers(); // cria headers

      headers.set(
        "Cache-Control",
        "public, max-age=3600"
      ); // adiciona cache de 1 hora

      return new Response(file, {
        headers // retorna arquivo com cache
      });
    }

    return new Response(
      "Not Found",
      { status: 404 } // retorna 404 caso não exista
    );
  },
});

console.log(
  `Server running at http://localhost:${server.port}`
); // mostra servidor rodando