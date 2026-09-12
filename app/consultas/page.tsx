'use client';

import { useState, useEffect } from 'react';
import { searchSinapi } from '@/app/actions/searchSinapi';
import { Search, Loader2 } from 'lucide-react';

export default function ConsultasPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load initial results (no query) on mount
  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const data = await searchSinapi(searchQuery);
      setResults(data);
      if (searchQuery) setHasSearched(true);
    } catch (error) {
      console.error('Failed to search', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Base SINAPI</h1>
          <p className="text-slate-500">
            Consulte os insumos oficiais da base SINAPI (Caixa) em tempo real.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={onSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código ou descrição do insumo..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
            </button>
          </form>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Código</th>
                  <th className="px-6 py-4 font-semibold w-full">Descrição do Insumo</th>
                  <th className="px-6 py-4 font-semibold">Unid.</th>
                  <th className="px-6 py-4 font-semibold text-right">Preço (Desonerado)</th>
                  <th className="px-6 py-4 font-semibold text-right">Preço (Não Desonerado)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.length > 0 ? (
                  results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">{item.codigo}</td>
                      <td className="px-6 py-4 whitespace-normal min-w-[300px] text-slate-700">
                        {item.descricao}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.unidade}</td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custo_desonerado || 0)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custo_nao_desonerado || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Buscando insumos...
                        </span>
                      ) : hasSearched ? (
                        'Nenhum insumo encontrado para sua busca.'
                      ) : (
                        'Digite algo para buscar insumos.'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {results.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
              <span>Exibindo {results.length} resultados.</span>
              <span>Referência: 01/2026 - PR</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
