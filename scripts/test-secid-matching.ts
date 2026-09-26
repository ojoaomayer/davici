import { searchSecidItem } from '../lib/secid-search';

const testItems = [
  { descricao: 'Projeto estrutural em concreto armado para edifício', unidade: 'M2', quantidade: 500 },
  { descricao: 'Sondagem a percussão SPT no terreno', unidade: 'FURO', quantidade: 4 },
  { descricao: 'Projeto preventivo contra incêndio e desastres PPCI', unidade: 'M2', quantidade: 1200 },
  { descricao: 'Levantamento topográfico planialtimétrico', unidade: 'M2', quantidade: 3000 },
  { descricao: 'Compatibilização de projetos em BIM', unidade: 'UN', quantidade: 1 },
  { descricao: 'Projeto elétrico e telecomunicações', unidade: 'M2', quantidade: 450 },
  { descricao: 'Projeto de arquitetura executivo', unidade: 'M2', quantidade: 350 },
  { descricao: 'Laudo pericial de vistoria cautelar de vizinhança', unidade: 'UN', quantidade: 1 },
  { descricao: 'Projeto de climatização e exaustão mecânica', unidade: 'M2', quantidade: 800 },
  { descricao: 'Arquiteto sênior para consultoria técnica de projeto', unidade: 'H', quantidade: 20 },
];

console.log('=== TESTE DE CORRESPONDÊNCIA SECID/PR ===\n');

for (const it of testItems) {
  const result = searchSecidItem(it);
  console.log(`Item: "${it.descricao}" (${it.quantidade} ${it.unidade})`);
  if (result.match) {
    console.log(`  -> MATCH: [${result.match.codigo}] ${result.match.descricao}`);
    console.log(`     Score: ${result.match.match_score}% | Status: ${result.match.status} | R$ ${result.match.custo_nao_desonerado}/${result.match.unidade}`);
  } else {
    console.log('  -> NENHUM MATCH');
  }
  console.log('');
}
