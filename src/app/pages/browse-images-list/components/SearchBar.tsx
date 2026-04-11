import { AiSearch } from '@/components/ai-company/ai-search';

export function SearchBar() {
  return (
    <div className="w-full px-3">
      <AiSearch 
        size="small" 
        placeholder="搜索形象" 
      />
    </div>
  );
}
