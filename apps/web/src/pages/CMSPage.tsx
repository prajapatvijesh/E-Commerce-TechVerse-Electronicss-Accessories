import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { AlertCircle } from 'lucide-react';

export const CMSPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      const res = await axios.get(`/api/settings/cms/${slug}`);
      return res.data.data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return <div className="min-h-[50vh] flex justify-center items-center"><div className="animate-spin h-10 w-10 border-b-2 border-primary-500 rounded-full"></div></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle size={48} className="text-gray-400" />
        <h1 className="text-2xl font-bold dark:text-white">Page Not Found</h1>
        <p className="text-gray-500">The page you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>{data.metaTitle || data.title} | TechVerse</title>
        {data.metaDescription && <meta name="description" content={data.metaDescription} />}
      </Helmet>

      <h1 className="text-4xl font-extrabold dark:text-white mb-8">{data.title}</h1>
      
      {/* 
        Using dangerouslySetInnerHTML because CMS content can contain HTML/Markdown.
        For production, it is advised to use DOMPurify to prevent XSS. 
      */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
};
