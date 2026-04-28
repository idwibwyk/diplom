import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ClipboardList, Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { homeworkFromBooking } from '@/app/lib/learnerBookingFields';
import { api } from '@/app/api/client';

type CourseBookingRow = {
  id: number;
  user_id: number;
  course_id: number;
  status: string;
  notes: string | null;
  homework_text?: string | null;
};
type CourseRow = { id: number; name: string };
type SubmissionRow = {
  id: number;
  course_booking_id: number;
  user_id: number;
  course_id: number;
  file_path: string;
  student_comment: string | null;
  score_percent: number | null;
  groomer_comment: string | null;
  status: string;
  reviewed_at?: string | null;
};

export function DashboardMyCourseHomeworkPage() {
  const { user } = useAuth();
  const { list: bookings } = useEntity<CourseBookingRow>('course_bookings', {
    fetchListOnMount: !!user,
    listParams: { limit: 100 },
    enabled: !!user,
  });
  const { list: courses } = useEntity<CourseRow>('courses', { fetchListOnMount: true, listParams: { limit: 100 } });

  const active = useMemo(() => {
    const mine = bookings.filter((b) => b.user_id === user?.id);
    return mine.find((b) => b.status === 'оплачен') ?? mine[0];
  }, [bookings, user?.id]);

  const course = active ? courses.find((c) => c.id === active.course_id) : undefined;
  const text = active ? homeworkFromBooking(active) : '';
  const [studentComment, setStudentComment] = useState('');
  const [docPath, setDocPath] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submission, setSubmission] = useState<SubmissionRow | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!active) return;
    void (async () => {
      const res = await api.get<{ success?: boolean; data?: SubmissionRow[] }>(`/course_homework_submissions/mine?course_id=${active.course_id}`);
      if ('error' in res) return;
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];
      const row = rows[0] ?? null;
      setSubmission(row);
      setStudentComment(row?.student_comment ?? '');
      setDocPath(row?.file_path ?? '');
    })();
  }, [active?.course_id]);

  const onUploadFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.uploadHomeworkFile(fd);
    setUploading(false);
    if (res.error || !res.data?.url) {
      setNotice(res.error || 'Не удалось загрузить файл');
      return;
    }
    setDocPath(res.data.url);
    setNotice('Файл загружен');
  };

  const submitHomework = async () => {
    if (!active?.id || !docPath || sending) return;
    setSending(true);
    setNotice('');
    const res = await api.post<{ success?: boolean; data?: SubmissionRow }>('/course_homework_submissions/submit', {
      course_booking_id: active.id,
      file_path: docPath,
      student_comment: studentComment.trim() || null,
    });
    setSending(false);
    if ('error' in res) {
      setNotice(res.error);
      return;
    }
    setSubmission((res.data as { data?: SubmissionRow })?.data ?? null);
    setNotice('Ответ по домашнему заданию сохранён');
    window.dispatchEvent(new CustomEvent('homework:updated'));
  };

  if (!user) {
    return (
      <div className="p-8">
        <Link to="/dashboard/my-courses" className="text-[#40AB40]">Мои курсы</Link>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="p-8 max-w-xl">
        <Link to="/dashboard/my-courses" className="inline-flex items-center gap-2 text-[#40AB40] mb-4">
          <ArrowLeft className="w-4 h-4" />
          Мои курсы
        </Link>
        <p className="text-gray-600">Нет записи на курс.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50/30 to-white dark:from-gray-900 dark:to-gray-950 pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link
          to="/dashboard/my-courses"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#40AB40] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Мои курсы
        </Link>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#40AB40]/15 text-[#40AB40]">
              <ClipboardList className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Домашнее задание</h1>
              <p className="text-sm text-gray-500">{course?.name ?? `Курс #${active.course_id}`}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {text || 'Домашнее задание отсутствует'}
            </p>
          </div>
          {text ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mt-5 space-y-4">
              <h2 className="text-lg font-semibold">Ваш ответ преподавателю</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium">Текстовый документ (TXT, PDF, DOC, DOCX)</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#40AB40]/50 text-[#40AB40] cursor-pointer hover:bg-[#40AB40]/5">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Загрузить файл
                    <input
                      type="file"
                      className="hidden"
                      accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => void onUploadFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {docPath ? (
                    <a href={docPath} target="_blank" rel="noreferrer" className="text-sm text-[#40AB40] underline break-all">
                      Открыть загруженный документ
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">Файл не выбран</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Комментарий к ответу</label>
                <textarea
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  placeholder="Опишите, как выполняли задание, что вызвало сложности и т.д."
                />
              </div>

              <button
                type="button"
                onClick={() => void submitHomework()}
                disabled={!docPath || sending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#40AB40] text-white hover:bg-[#359635] disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Сохранить ответ
              </button>

              {notice ? <p className="text-sm text-[#40AB40]">{notice}</p> : null}

              {submission ? (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                  <p>
                    Статус проверки:{' '}
                    <span className={submission.status === 'reviewed' ? 'text-[#40AB40] font-semibold' : 'text-amber-600 font-semibold'}>
                      {submission.status === 'reviewed' ? 'Проверено' : 'Отправлено, ожидает проверки'}
                    </span>
                  </p>
                  {submission.score_percent != null ? <p>Оценка: <span className="font-bold">{submission.score_percent}%</span></p> : null}
                  {submission.groomer_comment ? <p className="whitespace-pre-wrap">Комментарий грумера: {submission.groomer_comment}</p> : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
