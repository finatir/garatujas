import todo from "./core.ts"; // importa o sistema de tarefas

const server = Bun.serve({
  port: 3000, // porta do servidor

  routes: {

    "/": new Response(Bun.file("./public/index.html")), // rota principal

    "/api/todo": { // rota da api de tarefas

      GET: async () => { // pega todos os itens
        const items = await todo.getItems() // busca os itens
        return Response.json(items) // retorna em json
      },

      POST: async (req) => { // adiciona item novo
        const data = await req.json() as any; // pega os dados enviados
        const item = data.item || null; // pega o item

        if (!item) // verifica se veio item
          return Response.json(
            'Por favor, forneça um item para adicionar.',
            { status: 400 } // retorna erro
          );

        await todo.addItem(item); // adiciona item
        return Response.json(data); // retorna os dados
      },
    },

    "/api/todo/:index": { // rota usando index

      PUT: async (req) => { // atualiza item
        const index = parseInt(req.params.index); // pega index da url

        if (isNaN(index)) // verifica se é número
          return Response.json(
            'Índice inválido. um número inteiro é esperado.',
            { status: 400 } // retorna erro
          );

        const data = await req.json() as any; // pega os dados
        const newItem = data.newItem || null; // pega novo item

        if (!newItem) // verifica se veio item novo
          return Response.json(
            'Por favor, forneça um novo item para atualizar.',
            { status: 400 } // erro caso vazio
          );

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
        const index = parseInt(req.params.index); // pega index

        if (isNaN(index)) // verifica index
          return Response.json(
            'Índice inválido.',
            { status: 400 } // erro
          );

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

    // EXEMPLO BÁSICO

    "/api/exemplo": {

      GET: () => { // exemplo get
        return new Response(`Esse é o exemplo: ${Date.now()}`) // retorna timestamp
      },

      POST: async (req) => { // exemplo post
        const data = await req.json() as any; // pega dados
        data.recebidoEm = new Date().toLocaleDateString("pt-BR"); // adiciona data
        return Response.json(data); // retorna dados
      },
    },

    "/api/exemplo/:id": { // rota exemplo com id

      PUT: async (req, params) => { // atualiza tudo
        const { id } = req.params; // pega id
        const data = await req.json() as any; // pega dados

        data.id = id; // adiciona id
        data.recebidoEm = new Date().toLocaleDateString("pt-BR"); // adiciona data

        return Response.json(data); // retorna resposta
      },

      PATCH: async (req, params) => { // atualiza parcialmente
        const { id } = req.params; // pega id
        const data = await req.json() as any; // pega dados

        data.chavesAtualizadas = Object.keys(data); // mostra oq mudou
        data.id = id; // adiciona id
        data.atualizadoEm = new Date().toLocaleDateString("pt-BR"); // data update

        return Response.json(data); // retorna dados
      },

      DELETE: (req, params) => { // deleta recurso
        const { id } = req.params; // pega id

        return new Response(
          `Recurso com id ${id} deletado`,
          { status: 200 } // sucesso
        );
      }
    }

    // FIM DO EXEMPLO BÁSICO
  },

  async fetch(req) { // fallback caso rota nao exista
    return new Response(
      `Not Found`,
      { status: 404 } // erro 404
    );
  },
});

console.log(`Server running at http://localhost:${server.port}`); // mostra servidor rodando