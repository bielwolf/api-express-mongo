class ErroBase extends Error {
    constructor(mensagem = "Erro interno do servidor", status = 500) {
        super();
        this.mensage = mensagem;
        this.status = status;
    }

    enviaResposta(res) {
        res.status(this.status).send({
            mensagem: this.message,
            status: this.status
        });
    }
}

export default ErroBase;