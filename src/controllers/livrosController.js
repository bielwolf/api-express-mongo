import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autores, livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find()
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

        if (livroResultados !== null) {
          res.status(200).send(livroResultados);
          } else {
            next(new NaoEncontrado("Id do livro não localizado"));
        }
    } catch (erro) {
      next(erro)
        }
  }

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
        }
  }

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if( livroResultado !== null) {
      res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado"));
        }
    } catch (erro) {
      next(erro);
        }
  }

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro excluído com sucesso"});
        } else {
          next(new NaoEncontrado("Id do livro não localizado"));
          }
    } catch (erro) {
      next(erro);
        }
  }

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if(busca != null) {
      const livrosResultado = await livros
      .find(busca)
      .populate("autor");

       res.status(200).send(livrosResultado);
      } else {
        res.status(200).send([])
      }
    } catch (erro) {
      next(erro);
        }
  };
}

async function processaBusca(parametros) {
  const {editora, titulo, minPaginas, maxPaginas, nomeAutor} = parametros;

      let busca = {};
      if(editora) busca.editora = editora;
      if(titulo) busca.titulo = {$regex: titulo, $options: 'i'};

      if(minPaginas || maxPaginas) busca.numeroPaginas = {};
      if(minPaginas) busca.numeroPaginas.$gte = minPaginas;
      if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

      if(nomeAutor) {
        const autor = await autores.findOne({ nome: nomeAutor });

      if(autor != null) {
        busca.autor = autor._id;
        } else {
          busca = null;
        }
      }

      return busca;
}

export default LivroController