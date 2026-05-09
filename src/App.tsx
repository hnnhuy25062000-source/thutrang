import { useState, useRef, ChangeEvent } from 'react';
import { Save, FileText, Sparkles, Upload, Download, Trash2 } from 'lucide-react';

interface Activity {
  stage: string;
  activity: string;
  outcome: string;
  adjustment: string;
}

interface LessonPlanData {
  teacher: string;
  admin: string;
  className: string;
  week: string;
  unit: string;
  lesson: string;
  period: string;
  objectives: string;
  language: string;
  aids: string;
  digital: string;
  customContent: string;
  activities: Activity[];
  image: string;
}

const defaultActivities: Activity[] = [
  {
    stage: "1. Khởi động (Warm-up - 5 mins)",
    activity: "<b>Giáo viên (Teacher):</b> Greet the class, play 'Slap the board' game to review old words.\n<b>Học sinh (Students):</b> Greet the teacher, actively join the game.",
    outcome: "- Create a friendly and active learning atmosphere.\n- Students remember previous vocabulary.",
    adjustment: ""
  },
  {
    stage: "2. Khám phá (Presentation - 10 mins)",
    activity: "<b>Giáo viên (Teacher):</b> Introduce new vocabulary using flashcards and realia. Model the target sentence pattern.\n<b>Học sinh (Students):</b> Listen, point to the pictures, repeat, and take notes.",
    outcome: "- Students identify and pronounce the new words correctly.\n- Understand the meaning and usage of the new sentence pattern.",
    adjustment: ""
  },
  {
    stage: "3. Luyện tập (Practice - 12 mins)",
    activity: "<b>Giáo viên (Teacher):</b> Guide students to practice the pattern in pairs. Monitor and correct pronunciation.\n<b>Học sinh (Students):</b> Work in pairs to ask and answer using the target language. Complete textbook exercises.",
    outcome: "- Students confidently use the sentence pattern in controlled contexts.\n- Improve pronunciation and accuracy.",
    adjustment: ""
  },
  {
    stage: "4. Vận dụng (Production - 8 mins)",
    activity: "<b>Giáo viên (Teacher):</b> Organize a communicative task (role-play, survey, or interview).\n<b>Học sinh (Students):</b> Use the learned language to communicate naturally in groups, present results to the class.",
    outcome: "- Students apply the target language in real-life contexts.\n- Develop teamwork and presentation skills.",
    adjustment: ""
  }
];

export default function App() {
  const [data, setData] = useState<LessonPlanData>({
    teacher: '',
    admin: 'Trần Thị Thu Trang',
    className: '',
    week: '',
    unit: '',
    lesson: 'Lesson 1',
    period: '',
    objectives: '',
    language: '',
    aids: '',
    digital: '',
    customContent: '',
    activities: [...defaultActivities],
    image: ''
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof LessonPlanData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('image', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDigitalCompetence = (text: string) => {
    const current = data.digital;
    const newValue = current.length > 0 ? `${current}\n- ${text}` : `- ${text}`;
    handleInputChange('digital', newValue);
  };

  const autoGenerate = () => {
    const unitText = data.unit || 'Unit';
    const lessonText = data.lesson || 'Lesson';

    setData(prev => ({
      ...prev,
      objectives: `Năng lực đặc thù (Specific Competences):
- Identify and pronounce key words related to ${unitText};
- Use the target sentence pattern in simple communication;
Năng lực chung (General Competences):
- Communication, cooperation, self-study.
Phẩm chất (Qualities):
- Friendliness, confidence, responsibility.`,
      language: `Vocabulary: key words from ${unitText}.
Sentence pattern: target structure from ${lessonText}.
Skills: Listening, Speaking, Reading, Writing.`,
      aids: `Teacher's book, Student's book Global Success, flashcards, pictures, computer, projector, speaker, worksheets, and realia.`,
      digital: `- (1) Sử dụng thiết bị và công nghệ số: Giáo viên và học sinh tương tác với bài giảng điện tử (PowerPoint), tivi/bảng tương tác.
- (2) Tìm kiếm và xử lý thông tin: Khai thác học liệu số và âm thanh trên hoclieu.vn / sachmem.vn.
- (5) An toàn và đạo đức số: Nhắc nhở học sinh sử dụng thiết bị đúng mục đích học tập.`,
      customContent: `Differentiation:
- Support weaker students with visual prompts and repetition.
- Encourage stronger students to make longer answers.
Assessment:
- Observe students' participation, pronunciation, and use of the target language.
- Give quick oral feedback and positive reinforcement.`,
      activities: [...defaultActivities]
    }));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lesson_Plan_${data.className || "Class"}_Week${data.week || "X"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setData(prev => ({ ...prev, ...parsed }));
        } catch (err) {
          console.error("Invalid JSON", err);
          alert("Lỗi khi tải file JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  const formatText = (text: string) => {
    if (!text) return { __html: "&nbsp;" };
    return { __html: text.replace(/\n/g, "<br />") };
  };

  const exportWord = () => {
    if (!previewRef.current) return;
    
    const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Lesson Plan</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; color: #000; }
        .lesson-title { text-align: center; font-size: 18pt; font-weight: bold; margin: 16px 0; }
        table { width: 100%; border-collapse: collapse; margin: 14px 0; border: 1px solid #000; }
        td, th { border: 1px solid #000; padding: 7px; vertical-align: top; }
        .info-table { border: none !important; }
        .info-table td { border: none !important; padding: 5px; }
        .plan-table th { background: #e8f7f5; text-align: center; }
        .section-heading { font-weight: bold; margin-top: 14px; text-transform: uppercase; }
        .lesson-image { max-width: 500px; border-radius: 8px; margin: 12px 0; }
        .signatures { display: flex; justify-content: space-between; margin-top: 55px; text-align: center; font-weight: bold; }
        .header-table { width: 100%; border: none !important; margin-bottom: 20px; }
        .header-table td { border: none !important; padding: 0; text-align: center; vertical-align: top; }
      </style>
    </head>
    <body>
      ${previewRef.current.innerHTML}
    </body>
    </html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lesson_Plan_${data.className || "Class"}_Week${data.week || "X"}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-[#fcf5f7] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 h-full bg-white border-r border-pink-100 flex flex-col p-6 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mint-dark rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-mint-dark/20">GS</div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">LessonPlanner Pro</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Global Success Edition</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
          <div>
            <label className="sidebar-label">Instructor Info</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                value={data.teacher}
                onChange={e => handleInputChange('teacher', e.target.value)}
                placeholder="Teacher Name" 
                className="sidebar-input" 
              />
              <input 
                value={data.className}
                onChange={e => handleInputChange('className', e.target.value)}
                placeholder="Class" 
                className="sidebar-input" 
              />
            </div>
          </div>

          <div>
            <label className="sidebar-label">Lesson Context</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input 
                value={data.week}
                onChange={e => handleInputChange('week', e.target.value)}
                placeholder="Week" 
                className="sidebar-input" 
              />
              <input 
                value={data.period}
                onChange={e => handleInputChange('period', e.target.value)}
                placeholder="Period" 
                className="sidebar-input" 
              />
            </div>
            <div className="grid grid-cols-1 gap-2 mb-2">
              <input 
                value={data.unit}
                onChange={e => handleInputChange('unit', e.target.value)}
                placeholder="Unit Title" 
                className="sidebar-input" 
              />
              <select 
                value={data.lesson}
                onChange={e => handleInputChange('lesson', e.target.value)}
                className="sidebar-input cursor-pointer"
              >
                {['Lesson 1', 'Lesson 2', 'Lesson 3', 'Review', 'Fun time'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="sidebar-label">Objectives</label>
            <textarea 
              value={data.objectives}
              onChange={e => handleInputChange('objectives', e.target.value)}
              placeholder="Learning outcomes..."
              className="sidebar-input h-24 resize-none"
            />
          </div>

          <div>
            <label className="sidebar-label">Language Focus</label>
            <textarea 
              value={data.language}
              onChange={e => handleInputChange('language', e.target.value)}
              placeholder="Vocabulary, patterns..."
              className="sidebar-input h-20 resize-none"
            />
          </div>

          <div>
            <label className="sidebar-label">Teaching Aids</label>
            <textarea 
              value={data.aids}
              onChange={e => handleInputChange('aids', e.target.value)}
              placeholder="Materials needed..."
              className="sidebar-input h-20 resize-none"
            />
          </div>

          <div>
            <label className="sidebar-label">Digital Integration</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {[
                { label: 'LMS', text: '(1) Sử dụng thiết bị và công nghệ số: Tương tác với bài giảng điện tử (PowerPoint), bảng tương tác/tivi.' },
                { label: 'Search', text: '(2) Tìm kiếm và xử lý thông tin: Khai thác học liệu âm thanh, hình ảnh trên sachmem.vn / hoclieu.vn.' },
                { label: 'Quiz', text: '(3) Giao tiếp và hợp tác số: Tương tác qua trò chơi học tập trực tuyến (Wordwall, Quizizz, Blooket...).' },
              ].map(item => (
                <button 
                  key={item.label}
                  onClick={() => addDigitalCompetence(item.text)}
                  className="px-2 py-0.5 bg-mint-light text-mint-dark text-[9px] font-bold rounded-full border border-mint-dark/10 uppercase hover:bg-mint-dark hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <textarea 
              value={data.digital}
              onChange={e => handleInputChange('digital', e.target.value)}
              placeholder="Digital tools..."
              className="sidebar-input h-20 resize-none"
            />
          </div>

          <div>
            <label className="sidebar-label">Assets & Images</label>
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label 
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg py-4 cursor-pointer hover:bg-slate-100 hover:border-mint-dark transition-all"
              >
                <Upload className="w-4 h-4 text-slate-400 group-hover:text-mint-dark" />
                <span className="text-xs font-medium text-slate-500 group-hover:text-mint-dark">
                  {data.image ? 'Change Image' : 'Upload Asset'}
                </span>
              </label>
              {data.image && (
                <button 
                  onClick={() => handleInputChange('image', '')}
                  className="absolute -top-2 -right-2 p-1 bg-red-50 text-red-500 rounded-full border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-pink-100 space-y-2">
          <button onClick={autoGenerate} className="action-btn bg-mint-dark text-white hover:bg-mint-dark/90 w-full shadow-lg shadow-mint-dark/20">
            <Sparkles className="w-4 h-4" /> Generate Content
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={exportWord} className="action-btn border border-pink-200 text-pink-600 hover:bg-pink-50">
              <FileText className="w-4 h-4" /> Export
            </button>
            <button onClick={exportJSON} className="action-btn border border-pink-200 text-pink-600 hover:bg-pink-50">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
          <div className="w-full">
            <input type="file" id="load-json" accept="application/json" onChange={loadJSON} className="hidden" />
            <label htmlFor="load-json" className="action-btn border border-pink-200 text-pink-600 hover:bg-pink-50 w-full cursor-pointer">
              <Download className="w-4 h-4" /> Import JSON
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white/70 border-b border-pink-100 flex items-center justify-between px-8 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-pink-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span> 
              Live Preview
            </div>
            <div className="h-4 w-px bg-pink-200"></div>
            <span className="text-xs font-medium text-pink-400 font-mono">
              {data.unit ? data.unit.replace(/\s+/g, '_') : 'Untitled'}_Plan.docx
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-pink-50 rounded-lg p-1">
              <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-[10px] font-bold text-pink-700">Preview</button>
              <button className="px-4 py-1.5 text-[10px] font-bold text-pink-400 hover:text-pink-600">Structure</button>
            </div>
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-[#f8eef1] flex justify-center p-8 custom-scrollbar">
          <div ref={previewRef} className="lesson-paper">
            {/* Document Header */}
            <table className="w-full border-none mb-8" style={{ border: 'none' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', verticalAlign: 'top', border: 'none', padding: 0 }}>
                    UBND XÃ HIỆP PHƯỚC<br />
                    TRƯỜNG TIỂU HỌC TRANG TẤN KHƯƠNG
                  </td>
                  <td style={{ width: '50%', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'top', border: 'none', padding: 0 }}>
                    Người duyệt:<br />
                    {data.admin || "Trần Thị Thu Trang"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="lesson-title">
              KẾ HOẠCH BÀI DẠY<br/>
              <span style={{ fontSize: '13pt', fontWeight: 'normal', textTransform: 'none' }}>(LESSON PLAN)</span>
            </div>

            <table className="info-table">
              <tbody>
                <tr>
                  <td style={{ width: '50%' }}><strong>Subject:</strong> English - Global Success</td>
                  <td style={{ width: '50%' }}><strong>Week:</strong> {data.week}</td>
                </tr>
                <tr>
                  <td><strong>Teacher:</strong> {data.teacher}</td>
                  <td><strong>Class:</strong> {data.className}</td>
                </tr>
                <tr>
                  <td><strong>Unit:</strong> {data.unit}</td>
                  <td><strong>Period:</strong> {data.period}</td>
                </tr>
                <tr>
                  <td colSpan={2}><strong>Lesson:</strong> {data.lesson}</td>
                </tr>
              </tbody>
            </table>

            <div className="section-heading">I. Objectives (Yêu cầu cần đạt)</div>
            <div className="text-[10pt]" dangerouslySetInnerHTML={formatText(data.objectives)} />
            <div style={{ marginTop: '10px' }} className="text-[10pt]"><strong>Language Focus:</strong></div>
            <div className="text-[10pt]" dangerouslySetInnerHTML={formatText(data.language)} />

            <div className="section-heading">II. Teaching Aids (Đồ dùng dạy học)</div>
            <div className="text-[10pt]" dangerouslySetInnerHTML={formatText(data.aids)} />

            <div className="section-heading">III. Digital Competence (Tích hợp năng lực số)</div>
            <div className="text-[10pt]" dangerouslySetInnerHTML={formatText(data.digital)} />

            {data.image && (
              <>
                <div className="section-heading">IV. Teaching Image (Hình ảnh minh họa)</div>
                <img className="lesson-image" src={data.image} alt="Reference" />
              </>
            )}

            <div className="section-heading">V. Main Activities (Các hoạt động chủ yếu)</div>
            <table className="plan-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Activities</th>
                  <th style={{ width: '35%' }}>Expected Outcomes</th>
                  <th style={{ width: '20%' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.activities.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{item.stage}</div>
                      <div dangerouslySetInnerHTML={formatText(item.activity)} />
                    </td>
                    <td dangerouslySetInnerHTML={formatText(item.outcome)} />
                    <td dangerouslySetInnerHTML={formatText(item.adjustment)} />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-heading">VI. Notes (Ghi chú)</div>
            <div className="text-[10pt]" dangerouslySetInnerHTML={formatText(data.customContent)} />

            <div className="signatures">
              <div style={{ width: '33%' }}>
                Ban giám hiệu<br /><br /><br /><br />
                <span style={{ color: '#aaa', fontWeight: 'normal' }}>....................</span>
              </div>
              <div style={{ width: '33%' }}>
                Tổ trưởng chuyên môn<br /><br /><br /><br />
                <span style={{ color: '#aaa', fontWeight: 'normal' }}>....................</span>
              </div>
              <div style={{ width: '33%' }}>
                Giáo viên giảng dạy<br /><br /><br /><br />
                {data.teacher || <span style={{ color: '#aaa', fontWeight: 'normal' }}>....................</span>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
