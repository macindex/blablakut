import React from "react";
import styled from "styled-components";
import MainGrid from "../src/components/MainGrid/index";
import Box from "../src/components/Box/index";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations/index";

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `
function ProfileSidebar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.gitHubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <a className="boxLink" href={`https://github.com/${props.gitHubUser}`}>
        @{props.gitHubUser}
      </a>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}
function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smalltitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {/* {seguidores.map((iAtual) => {
                return (
                  <li key={iAtual}>
                    <a href={`/users/${iAtual}`} >
                      <img src={`https://github.com/${iAtual}.png`} />
                      <span>{iAtual.title}</span>
                    </a>
                  </li>
                );
              })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const [comunidades, setComunidades] = React.useState([{}]);
    
      //   id: '',
      //   title: 'Eu odeio acordar cedo',
      //   image: 'https://pbs.twimg.com/profile_images/143696361/avatar_400x400.jpg'
      // },{
      //   id: '',
      //   title: 'Bonde dos cu sujo',
      //   image: 'https://img.elo7.com.br/product/zoom/376BFA1/caneca-unicornio-bom-dia-cu-sujo-frases.jpg'
      // }
    
  
  const gitHubUser = "macindex";
  // const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
    "omariosouto",
    "peas",
    "elolourenco",
    "macindex",
    "felipefialho",
    "juunegreiros",
  ];

  // 0 - Pegar o array de dados do github
  // 1 - Criar box que vai ter um map baseado nos itens do array
  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch("https://api.github.com/users/macindex/followers")
      .then(function (resServer) {
        return resServer.json();
      })
      .then(function (resCompleta) {
        setSeguidores(resCompleta);
      });

    fetch("https://graphql.datocms.com", {
      method: "POST",
      headers: {
        Authorization: "1a9a769ba7db7679a3a8663d62616f",
        "Content-Type": "application/json",
        'Accept': "application/json",
      },
      body: JSON.stringify({
        "query": `{
      allCommunities{
        id
        title
        imageUrl
        creatorSlug
      }
    }
    `
      })
    })
      .then((response) => response.json())
      .then((resCompleta) => {
        const comunidadesDato = resCompleta.data.allCommunities;
        // console.log(comunidades);
        setComunidades(comunidadesDato)
        
        
      });
  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar gitHubUser={gitHubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriarComunidade(e) {
                e.preventDefault();
                const dadosForm = new FormData(e.target);

                const comunidade = {
                  // id: new Date().toISOString(),
                  title: dadosForm.get("title"),
                  imageUrl: dadosForm.get("image"),
                  creatorSlug: gitHubUser,
                };

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async(res) => {
                  const dados = await res.json();
                  const comunidade = dados.regCriado;
                  const comAtualizadas = [...comunidades, comunidade];
                  setComunidades(comAtualizadas);
                
                })

                
                // comunidades.push('Alura stars')
                // setComunidades('Alura stars')
              }}
            >
              <div>
                <input
                  placeholder="Qual vai sero nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade ?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Qual vai ser o nome da sua comunidade ?"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <ul>
              {comunidades.map((iAtual) => {
                return (
                  <li key={iAtual}>
                    <a href={`/communities/${iAtual.id}`}>
                      <img src={iAtual.imageUrl} />
                      <span>{iAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smalltitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((iAtual) => {
                return (
                  <li>
                    <a href={`/users/${iAtual}`} key={iAtual}>
                      <img src={`https://github.com/${iAtual}.png`} />
                      <span>{iAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
