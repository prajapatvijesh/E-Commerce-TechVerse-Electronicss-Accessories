import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@techverse/ui';
import { Plus, Trash2, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const HomepageCMS: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const [heroBanners, setHeroBanners] = useState([{ image: '', title: '', subtitle: '', link: '' }]);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [footerText, setFooterText] = useState('');

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['homepage-settings'],
    queryFn: async () => {
      const res = await axios.get('/api/homepage-settings');
      return res.data.data;
    }
  });

  useEffect(() => {
    if (settingsData) {
      if (settingsData.heroBanners?.length > 0) setHeroBanners(settingsData.heroBanners);
      if (settingsData.faqs?.length > 0) setFaqs(settingsData.faqs);
      setFooterText(settingsData.footerText || '');
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => axios.put('/api/homepage-settings', data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      alert('Homepage Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['homepage-settings'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ heroBanners, faqs, footerText });
  };

  const updateBanner = (index: number, field: string, value: string) => {
    const newBanners: any = [...heroBanners];
    newBanners[index][field] = value;
    setHeroBanners(newBanners);
  };

  const addBanner = () => setHeroBanners([...heroBanners, { image: '', title: '', subtitle: '', link: '' }]);
  const removeBanner = (index: number) => setHeroBanners(heroBanners.filter((_, i) => i !== index));

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs: any = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  if (isLoading) return <div className="p-8 dark:text-white">Loading CMS settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Homepage CMS</h1>
        <Button variant="primary" className="flex items-center space-x-2" onClick={handleSave} disabled={updateMutation.isPending}>
          <Save size={16} />
          <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Hero Banners</CardTitle>
          <Button variant="outline" size="sm" onClick={addBanner}><Plus size={16} /> Add Banner</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {heroBanners.map((banner, idx) => (
            <div key={idx} className="p-4 border border-gray-200 dark:border-dark-700 rounded-xl relative flex flex-col gap-4">
              <button onClick={() => removeBanner(idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Image URL" value={banner.image} onChange={(e) => updateBanner(idx, 'image', e.target.value)} placeholder="https://..." />
                <Input label="Link" value={banner.link} onChange={(e) => updateBanner(idx, 'link', e.target.value)} placeholder="/shop" />
                <Input label="Title" value={banner.title} onChange={(e) => updateBanner(idx, 'title', e.target.value)} placeholder="Welcome..." />
                <Input label="Subtitle" value={banner.subtitle} onChange={(e) => updateBanner(idx, 'subtitle', e.target.value)} placeholder="Subtitle..." />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Frequently Asked Questions (FAQs)</CardTitle>
          <Button variant="outline" size="sm" onClick={addFaq}><Plus size={16} /> Add FAQ</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 border border-gray-200 dark:border-dark-700 rounded-xl relative flex flex-col gap-4">
              <button onClick={() => removeFaq(idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
              <Input label="Question" value={faq.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} />
              <Input label="Answer" value={faq.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="Footer Text" value={footerText} onChange={(e) => setFooterText(e.target.value)} />
        </CardContent>
      </Card>
    </div>
  );
};
