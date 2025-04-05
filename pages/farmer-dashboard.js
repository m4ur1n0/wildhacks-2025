import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import CSAManager from '@/components/CSAManager';
import BlogEditor from '@/components/BlogEditor';

export default function FarmerDashboard() {
  const [user] = useAuthState(auth);
  const [csaPrograms] = useCollection(
    query(collection(db, 'csaPrograms'), where('farmerId', '==', user?.uid))
  );

  return (
    <div className="dashboard">
      <h2>Farmer Dashboard</h2>
      <div className="tabs">
        <div className="tab-content">
          <h3>CSA Programs</h3>
          <CSAManager farmerId={user?.uid} />
          {csaPrograms?.docs.map(doc => (
            <div key={doc.id} className="csa-program">
              <h4>{doc.data().name}</h4>
              <p>Shares available: {doc.data().totalShares}</p>
            </div>
          ))}
        </div>
        <div className="tab-content">
          <h3>Blog Management</h3>
          <BlogEditor csaProgramId={csaPrograms?.docs[0]?.id} />
        </div>
      </div>
    </div>
  );
}
