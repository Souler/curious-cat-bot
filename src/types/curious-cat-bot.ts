export interface CuriousCatBotConstructorArguments {
    telegram: {
        token: string,
        webHook?: {
            port: number,
        }
    },
    curiouscat: {
        token: string,
    },
}
