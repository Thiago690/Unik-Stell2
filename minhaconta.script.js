import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

@Controller // Indica que esta classe é um Controller Spring para lidar com requisições HTTP
public class RegistroController {

    // O PostMapping mapeia esta função para a URL '/cadastrar' e o método POST
    // que é o que definimos no atributo 'action' do formulário HTML.
    @PostMapping("/cadastrar")
    public RedirectView processarCadastro(
        // @RequestParam mapeia os campos do formulário HTML pelos seus 'name'
        @RequestParam("nome") String nome,
        @RequestParam("email") String email,
        @RequestParam("senha") String senha,
        @RequestParam("confirmar-senha") String confirmarSenha
        // Nota: Em um projeto real, você usaria um objeto DTO/Model em vez de @RequestParam
    ) {

        System.out.println("--- Recebendo Dados de Cadastro ---");
        System.out.println("Nome: " + nome);
        System.out.println("Email: " + email);
        
        // 1. Validação Simples (Exemplo)
        if (!senha.equals(confirmarSenha)) {
            System.err.println("Erro: As senhas não coincidem!");
            // Em um projeto real, você redirecionaria com uma mensagem de erro
            return new RedirectView("/cadastro.html?erro=senhasdiferentes"); 
        }

        // 2. Lógica de Negócio (Onde o Java entra!)
        
        /* * **Ações Típicas de Backend:**
        * a) Hash da Senha (NUNCA armazene senhas em texto puro! Use BCrypt, Argon2, etc.)
        * String senhaHashed = passwordEncoder.encode(senha);
        *
        * b) Validação Avançada (Ex: email já existe no banco?)
        *
        * c) Persistência no Banco de Dados
        * Usuario novoUsuario = new Usuario(nome, email, senhaHashed);
        * usuarioRepository.save(novoUsuario);
        */

        System.out.println("Cadastro realizado com sucesso para: " + email);

        // 3. Resposta (Redirecionamento)
        // Redireciona o usuário para a página de login após o cadastro
        return new RedirectView("/login.html?sucesso=true"); 
    }
}