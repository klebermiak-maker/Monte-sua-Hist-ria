import {
  collection,
  doc,
  addDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../utils/firebase';
import { StoryCard } from '../data/storyCards';

export interface MuralStory {
  id: string;
  title: string;
  author: string;
  studentGrade?: string;
  studentClass?: string;
  studentTurma?: string;
  schoolName?: string;
  authorUid: string;
  genreId: string;
  genreName: string;
  createdAt: string;
  coverEmoji: string;
  coverBg: string;
  wordCount: number;
  likesCount: number;
  cards: {
    personagem?: StoryCard | null;
    lugar?: StoryCard | null;
    acao?: StoryCard | null;
    complemento?: StoryCard | null;
  };
  sections: {
    key: string;
    title: string;
    content: string;
  }[];
}

const COLLECTION_NAME = 'community_stories';

// Real-time listener for community mural stories
export function subscribeToMuralStories(
  onUpdate: (stories: MuralStory[]) => void,
  onError?: (error: Error) => void
): () => void {
  const collRef = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    collRef,
    (snapshot) => {
      const list: MuralStory[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || 'História Sem Título',
          author: data.author || 'Autor(a) Mirim',
          studentGrade: data.studentGrade || undefined,
          studentClass: data.studentClass || undefined,
          studentTurma: data.studentTurma || (data.studentGrade && data.studentClass ? `${data.studentGrade}º Ano ${data.studentClass}` : undefined),
          schoolName: data.schoolName || undefined,
          authorUid: data.authorUid || 'anon',
          genreId: data.genreId || 'narrativa',
          genreName: data.genreName || 'Narrativa',
          createdAt: data.createdAt || 'Recentemente',
          coverEmoji: data.coverEmoji || '📖',
          coverBg: data.coverBg || 'from-amber-400 to-orange-500',
          wordCount: Number(data.wordCount) || 0,
          likesCount: Number(data.likesCount) || 0,
          cards: data.cards || {},
          sections: Array.isArray(data.sections) ? data.sections : [],
        });
      });

      // Client-side sort by likes or recent
      list.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      onUpdate(list);
    },
    (err) => {
      console.error('Erro ao escutar Mural das Histórias:', err);
      try {
        handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );

  return unsubscribe;
}

// Publish a story to Firebase Firestore Mural
export async function publishStoryToMural(
  storyData: Omit<MuralStory, 'id' | 'likesCount'>
): Promise<string> {
  const uid = auth.currentUser?.uid || `aluno_${Date.now()}`;
  const payload: any = {
    title: storyData.title.trim() || 'Minha História Incrível',
    author: storyData.author.trim() || 'Jovem Escritor(a)',
    authorUid: uid,
    genreId: storyData.genreId || 'narrativa',
    genreName: storyData.genreName || 'Narrativa de Aventura',
    createdAt: storyData.createdAt || new Date().toLocaleDateString('pt-BR'),
    coverEmoji: storyData.coverEmoji || '📖',
    coverBg: storyData.coverBg || 'from-amber-400 to-orange-500',
    wordCount: Number(storyData.wordCount) || 0,
    likesCount: 0,
    cards: storyData.cards || {},
    sections: (storyData.sections || []).map((s) => ({
      key: s.key,
      title: s.title,
      content: s.content || '',
    })),
  };

  if (storyData.studentGrade) payload.studentGrade = String(storyData.studentGrade);
  if (storyData.studentClass) payload.studentClass = String(storyData.studentClass);
  if (storyData.studentTurma) payload.studentTurma = String(storyData.studentTurma);
  if (storyData.schoolName) payload.schoolName = String(storyData.schoolName);

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    throw error;
  }
}

// Give a star / like to a story on the Mural
export async function likeStoryOnMural(storyId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, storyId);
  try {
    await updateDoc(docRef, {
      likesCount: increment(1),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${storyId}`);
    throw error;
  }
}
