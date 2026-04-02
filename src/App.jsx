import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function CarteRepas({ emoji, titre, date, couleur, badge, couleurBadge }) {
  return (
    <div style={{minWidth:'130px', background:'#fff', borderRadius:'16px', border:'1.5px solid #FFE5D0', overflow:'hidden', marginBottom:'10px'}}>
      <div style={{height:'72px', background: couleur, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px'}}>{emoji}</div>
      <div style={{padding:'8px'}}>
        <div style={{fontSize:'11px', fontWeight:'800', color:'#222'}}>{titre}</div>
        <div style={{fontSize:'10px', color:'#888', fontWeight:'600'}}>{date}</div>
        <div style={{fontSize:'9px', fontWeight:'700', padding:'2px 6px', borderRadius:'20px', background: couleurBadge, color:'#D04A10', display:'inline-block', marginTop:'4px'}}>{badge}</div>
      </div>
    </div>
  )
}

function Nav({ ecran, setEcran }) {
  return (
    <div style={{background:'#fff', borderTop:'1.5px solid #FFE5D0', display:'flex', justifyContent:'space-around', padding:'8px 0 14px', position:'sticky', bottom:'0'}}>
      {[['🏠','accueil'],['🔍','chercher'],['🍽️','mesrepas'],['🏆','classement'],['👤','profil']].map(([icon, nom]) => (
        <div key={nom} onClick={() => setEcran(nom)} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', cursor:'pointer'}}>
          <div style={{width:'28px', height:'28px', borderRadius:'50%', background: ecran === nom ? '#FFE5D0' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>{icon}</div>
          <div style={{fontSize:'9px', fontWeight:'700', color: ecran === nom ? '#FF6B35' : '#bbb'}}>{nom}</div>
        </div>
      ))}
    </div>
  )
}

function EcranAccueil({ setEcran }) {
  return (
    <div>
      <div style={{background:'#FF6B35', padding:'10px 16px 16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
          <span style={{fontFamily:'Pacifico, cursive', fontSize:'22px', color:'#fff'}}>Mange Chez Moi</span>
          <div style={{display:'flex', gap:'10px'}}>
            <div style={{width:'34px', height:'34px', borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>🔔</div>
            <div style={{width:'34px', height:'34px', borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>💬</div>
          </div>
        </div>
      </div>
      <div style={{background:'#fff', padding:'14px 16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
          <span style={{fontSize:'14px', fontWeight:'800'}}>Repas à venir</span>
          <span style={{fontSize:'11px', fontWeight:'700', color:'#FF6B35'}}>Tout voir</span>
        </div>
        <div style={{display:'flex', gap:'10px', overflowX:'auto'}}>
          <CarteRepas emoji="🥘" titre="Tajine maison" date="Sam. 5 avr. · 19h" couleur="#FFECD0" badge="1 place dispo" couleurBadge="#FFE5D0"/>
          <CarteRepas emoji="🍜" titre="Ramen japonais" date="Dim. 6 avr. · 20h" couleur="#E0F5E8" badge="3 places" couleurBadge="#E0F5E8"/>
          <CarteRepas emoji="🍕" titre="Pizza napolitaine" date="Lun. 7 avr. · 19h30" couleur="#EDE0FF" badge="2 places" couleurBadge="#EDE0FF"/>
        </div>
      </div>
      <div style={{background:'#F7F2EC', padding:'14px 16px'}}>
        <div style={{fontSize:'14px', fontWeight:'800', marginBottom:'12px'}}>La communauté</div>
        <div onClick={() => setEcran('creerrepas')} style={{background:'#FF6B35', borderRadius:'16px', padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', cursor:'pointer'}}>
          <span style={{fontSize:'24px'}}>🍳</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'13px', fontWeight:'800', color:'#fff'}}>Organise un repas chez toi</div>
            <div style={{fontSize:'11px', color:'rgba(255,255,255,0.8)', fontWeight:'600'}}>3-4 invités · tu fixes le prix</div>
          </div>
          <span style={{fontSize:'18px', color:'rgba(255,255,255,0.7)'}}>›</span>
        </div>
        <div style={{background:'#fff', borderRadius:'18px', border:'1.5px solid #FFE5D0', overflow:'hidden'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'11px 12px'}}>
            <div style={{width:'38px', height:'38px', borderRadius:'50%', background:'#FFE5D0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'}}>👩</div>
            <div>
              <div style={{fontSize:'13px', fontWeight:'800'}}>Sophie M.</div>
              <div style={{fontSize:'11px', color:'#888', fontWeight:'600'}}>Marseille · ⭐ 4.9</div>
            </div>
            <div style={{marginLeft:'auto', fontSize:'10px', color:'#bbb', fontWeight:'600'}}>Il y a 2h</div>
          </div>
          <div style={{height:'150px', background:'#FFECD0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'56px'}}>🫕</div>
          <div style={{padding:'10px 12px'}}>
            <div style={{fontSize:'13px', fontWeight:'800', marginBottom:'4px'}}>Soupe pho maison</div>
            <div style={{fontSize:'11px', color:'#666', fontWeight:'600'}}>Une soirée incroyable autour d'un pho préparé depuis 6h du matin !</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'8px', padding:'0 12px 10px'}}>
            <div style={{fontSize:'11px', fontWeight:'700', color:'#D04A10', padding:'4px 8px', borderRadius:'20px', background:'#FFEDE5', border:'1.5px solid #FF6B35'}}>❤ 24</div>
            <div style={{fontSize:'11px', fontWeight:'700', color:'#888', padding:'4px 8px', borderRadius:'20px', border:'1.5px solid #eee'}}>💬 8</div>
            <div style={{marginLeft:'auto', background:'#FF6B35', color:'#fff', fontSize:'12px', fontWeight:'800', padding:'5px 12px', borderRadius:'20px'}}>8 €/pers</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EcranChercher({ setEcran, user }) {
  const [repas, setRepas] = useState([])
  const [erreur, setErreur] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function chargerRepas() {
      const { data, error } = await supabase.from('repas').select('*')
      if (error) { setErreur(error.message) }
      else { setRepas(data) }
    }
    chargerRepas()
  }, [])

async function reserver(repasId) {
  console.log('réservation pour repas:', repasId, 'user:', user.id)
  const { error } = await supabase.from('reservations').insert({
    repas_id: repasId,
    user_id: user.id
  })
  if (error) { setMessage('Erreur : ' + error.message) }
  else { 
    console.log('succès !')
    setMessage('Réservation confirmée ! 🎉') 
  }
}

  return (
    <div>
      <div style={{background:'#FF6B35', padding:'10px 16px 16px'}}>
        <div style={{fontFamily:'Pacifico, cursive', fontSize:'18px', color:'#fff', marginBottom:'10px'}}>Trouver un repas</div>
        <div style={{background:'#fff', borderRadius:'14px', display:'flex', alignItems:'center', gap:'8px', padding:'9px 12px'}}>
          <span style={{fontSize:'15px'}}>🔍</span>
          <span style={{fontSize:'13px', fontWeight:'600', color:'#999'}}>Cuisine, quartier, hôte...</span>
        </div>
      </div>
      <div style={{padding:'14px 16px'}}>
        {erreur && <div style={{color:'red', fontSize:'12px', marginBottom:'10px'}}>{erreur}</div>}
        {message && <div style={{background:'#E0F5E8', color:'#085041', fontSize:'12px', fontWeight:'600', padding:'10px 12px', borderRadius:'10px', marginBottom:'10px'}}>{message}</div>}
        <div style={{fontSize:'14px', fontWeight:'800', marginBottom:'12px'}}>{repas.length} repas disponibles</div>
        {repas.map((r) => (
          <div key={r.id} style={{background:'#fff', borderRadius:'16px', border:'1.5px solid #FFE5D0', overflow:'hidden', marginBottom:'10px'}}>
            <div style={{height:'72px', background: r.couleur, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px'}}>{r.emoji}</div>
            <div style={{padding:'10px 12px'}}>
              <div style={{fontSize:'13px', fontWeight:'800', color:'#222', marginBottom:'2px'}}>{r.titre}</div>
              <div style={{fontSize:'11px', color:'#888', fontWeight:'600', marginBottom:'6px'}}>{r.date} · {r.prix} €/pers</div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'20px', background: r.couleur, color:'#D04A10'}}>{r.badge}</div>
                <div onClick={() => reserver(r.id)} style={{background:'#FF6B35', color:'#fff', fontSize:'11px', fontWeight:'700', padding:'6px 14px', borderRadius:'20px', cursor:'pointer'}}>Réserver</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcranCreerRepas({ setEcran }) {
  const [titre, setTitre] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [date, setDate] = useState('')
  const [places, setPlaces] = useState(4)
  const [prix, setPrix] = useState(10)
  const [message, setMessage] = useState('')

  async function creerRepas() {
    if (!titre || !date) {
      setMessage('Remplis le titre et la date !')
      return
    }
    const { error } = await supabase.from('repas').insert({
      titre, emoji, date, places, prix,
      couleur: '#FFECD0',
      badge: places + ' places dispo'
    })
    if (error) { setMessage('Erreur : ' + error.message) }
    else { setMessage('Repas créé !'); setEcran('chercher') }
  }

  return (
    <div>
      <div style={{background:'#FF6B35', padding:'10px 16px 14px', display:'flex', alignItems:'center', gap:'10px'}}>
        <div onClick={() => setEcran('accueil')} style={{color:'#fff', fontSize:'18px', cursor:'pointer'}}>←</div>
        <span style={{fontFamily:'Pacifico, cursive', fontSize:'18px', color:'#fff'}}>Nouveau repas</span>
      </div>
      <div style={{padding:'16px'}}>
        <div style={{marginBottom:'14px'}}>
          <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase'}}>Emoji du plat</div>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            {['🍽️','🥘','🍜','🍕','🫕','🍲','🥗','🍣'].map(e => (
              <div key={e} onClick={() => setEmoji(e)} style={{width:'40px', height:'40px', borderRadius:'10px', background: emoji === e ? '#FFE5D0' : '#f5f5f5', border: emoji === e ? '2px solid #FF6B35' : '1.5px solid #eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', cursor:'pointer'}}>{e}</div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:'14px'}}>
          <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase'}}>Titre du repas</div>
          <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Tajine maison aux pruneaux" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'13px', outline:'none'}}/>
        </div>
        <div style={{marginBottom:'14px'}}>
          <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase'}}>Date & heure</div>
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="Ex: Sam. 5 avr. · 19h" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'13px', outline:'none'}}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
          <div>
            <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase'}}>Nb invités</div>
            <input type="number" value={places} onChange={e => setPlaces(Number(e.target.value))} min="1" max="8" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'16px', fontWeight:'800', color:'#FF6B35', outline:'none', textAlign:'center'}}/>
          </div>
          <div>
            <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase'}}>Prix (€)</div>
            <input type="number" value={prix} onChange={e => setPrix(Number(e.target.value))} min="0" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'16px', fontWeight:'800', color:'#FF6B35', outline:'none', textAlign:'center'}}/>
          </div>
        </div>
        {message && <div style={{background: message === 'Repas créé !' ? '#E0F5E8' : '#FFEDE5', color: message === 'Repas créé !' ? '#085041' : '#D04A10', fontSize:'12px', fontWeight:'600', padding:'10px 12px', borderRadius:'10px', marginBottom:'14px'}}>{message}</div>}
        <div onClick={creerRepas} style={{background:'#FF6B35', borderRadius:'14px', padding:'14px', textAlign:'center', fontSize:'14px', fontWeight:'800', color:'#fff', cursor:'pointer'}}>
          Publier mon repas 🎉
        </div>
      </div>
    </div>
  )
}

function EcranMesRepas({ setEcran }) {
  const repas = [
    { emoji:'🫕', titre:'Tajine agneau pruneaux', date:'28 mars · 4 invités', note:'★★★★★', pts:'+28 pts', couleur:'#FFECD0' },
    { emoji:'🥘', titre:'Couscous royal maison', date:'14 mars · 3 invités', note:'★★★★', pts:'+24 pts', couleur:'#E0F5E8' },
    { emoji:'🍲', titre:'Harira & pastilla', date:'2 mars · 4 invités', note:'★★★★★', pts:'+31 pts', couleur:'#EDE0FF' },
  ]
  return (
    <div>
      <div style={{background:'#FF6B35', padding:'10px 16px 14px'}}>
        <span style={{fontFamily:'Pacifico, cursive', fontSize:'18px', color:'#fff'}}>Mes repas</span>
      </div>
      <div style={{padding:'14px 16px'}}>
        <div onClick={() => setEcran('creerrepas')} style={{background:'#FF6B35', borderRadius:'16px', padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', cursor:'pointer'}}>
          <span style={{fontSize:'24px'}}>🍳</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'13px', fontWeight:'800', color:'#fff'}}>Organiser un nouveau repas</div>
            <div style={{fontSize:'11px', color:'rgba(255,255,255,0.8)', fontWeight:'600'}}>3-4 invités · tu fixes le prix</div>
          </div>
          <span style={{fontSize:'18px', color:'rgba(255,255,255,0.7)'}}>›</span>
        </div>
        <div style={{fontSize:'13px', fontWeight:'800', color:'#222', marginBottom:'12px'}}>Historique</div>
        {repas.map((r) => (
          <div key={r.titre} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid #FFE5D0'}}>
            <div style={{width:'44px', height:'44px', borderRadius:'12px', background:r.couleur, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0}}>{r.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'13px', fontWeight:'800', color:'#222'}}>{r.titre}</div>
              <div style={{fontSize:'11px', color:'#aaa', fontWeight:'600', marginTop:'2px'}}>{r.date}</div>
              <div style={{color:'#FFD600', fontSize:'11px', marginTop:'2px'}}>{r.note}</div>
            </div>
            <div style={{background:'#EEEDFE', color:'#3C3489', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'20px'}}>{r.pts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcranClassement({ setEcran }) {
  const joueurs = [
    { nom:'Sophie M.', emoji:'👩', pts:94, rang:1 },
    { nom:'Léa Martin', emoji:'👩', pts:78, rang:2 },
    { nom:'Karim B.', emoji:'👨', pts:42, rang:3 },
    { nom:'Marco R.', emoji:'🧑', pts:38, rang:4 },
    { nom:'Amina S.', emoji:'👩', pts:29, rang:5 },
  ]
  return (
    <div>
      <div style={{background:'#FF6B35', padding:'10px 16px 14px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
          <span style={{fontFamily:'Pacifico, cursive', fontSize:'18px', color:'#fff'}}>Classement</span>
          <div style={{background:'rgba(255,255,255,0.25)', borderRadius:'20px', padding:'5px 12px', fontSize:'11px', fontWeight:'700', color:'#fff'}}>Manche 4 · Avr.</div>
        </div>
        <div style={{background:'rgba(0,0,0,0.15)', borderRadius:'10px', padding:'8px 12px', display:'flex', justifyContent:'space-between'}}>
          <span style={{fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.9)'}}>Fin de manche dans</span>
          <span style={{fontSize:'13px', fontWeight:'800', color:'#fff'}}>12 jours</span>
        </div>
      </div>
      <div style={{background:'#fff', padding:'10px 16px', borderBottom:'1.5px solid #FFE5D0', display:'flex', alignItems:'center', gap:'10px'}}>
        <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#FFE5D0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'800', color:'#D04A10'}}>3</div>
        <div style={{flex:1}}>
          <div style={{fontSize:'13px', fontWeight:'800'}}>Toi — Karim B.</div>
          <div style={{fontSize:'11px', color:'#888', fontWeight:'600'}}>42 pts · +8 pts cette semaine</div>
        </div>
        <div style={{background:'#FFF0E8', color:'#D04A10', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'20px'}}>Top 3 !</div>
      </div>
      <div style={{padding:'8px 16px'}}>
        {joueurs.map((j) => (
          <div key={j.nom} style={{display:'flex', alignItems:'center', gap:'10px', padding:'9px 0', borderBottom:'1px solid #FFE5D0', background: j.nom === 'Karim B.' ? '#FFF0E8' : 'transparent'}}>
            <div style={{width:'26px', textAlign:'center', fontSize:'13px', fontWeight:'800', color: j.rang === 1 ? '#854F0B' : j.rang === 2 ? '#5F5E5A' : j.rang === 3 ? '#993C1D' : '#aaa'}}>
              {j.rang === 1 ? '🥇' : j.rang === 2 ? '🥈' : j.rang === 3 ? '🥉' : j.rang}
            </div>
            <div style={{width:'34px', height:'34px', borderRadius:'50%', background:'#FFE5D0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>{j.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'13px', fontWeight:'800', color:'#222'}}>{j.nom}</div>
            </div>
            <div style={{fontSize:'13px', fontWeight:'800', color:'#FF6B35'}}>{j.pts} pts</div>
          </div>
        ))}
      </div>
      <div style={{margin:'10px 16px', background:'#222', borderRadius:'16px', padding:'14px', display:'flex', alignItems:'center', gap:'12px'}}>
        <span style={{fontSize:'28px'}}>🏆</span>
        <div style={{flex:1}}>
          <div style={{fontSize:'13px', fontWeight:'800', color:'#FFD600'}}>Grande Finale — Mois 5</div>
          <div style={{fontSize:'11px', color:'rgba(255,255,255,0.7)', fontWeight:'600', marginTop:'2px'}}>Top 3 cette manche → qualifiés</div>
        </div>
        <span style={{fontSize:'18px', color:'rgba(255,255,255,0.5)'}}>›</span>
      </div>
    </div>
  )
}

function EcranProfil({ setEcran, setUser, user }) {
  const [profil, setProfil] = useState(null)

  useEffect(() => {
    async function chargerProfil() {
      const { data } = await supabase.from('profils').select('*').eq('id', user.id).single()
      setProfil(data)
    }
    chargerProfil()
  }, [])
  return (
    <div>
      <div style={{background:'#FF6B35', padding:'10px 16px 24px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <span style={{fontFamily:'Pacifico, cursive', fontSize:'17px', color:'#fff'}}>Mon profil</span>
          <div onClick={async () => { await supabase.auth.signOut(); setUser(null) }} style={{background:'rgba(255,255,255,0.25)', borderRadius:'20px', padding:'5px 12px', fontSize:'12px', fontWeight:'700', color:'#fff', cursor:'pointer'}}>Déconnexion</div>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
          <div style={{width:'72px', height:'72px', borderRadius:'50%', background:'#FFE5D0', border:'3px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px'}}>👨</div>
      <div style={{fontSize:'17px', fontWeight:'800', color:'#fff'}}>{profil?.prenom || user?.email}</div>
          <div style={{fontSize:'12px', color:'rgba(255,255,255,0.8)', fontWeight:'600'}}>📍 Marseille 13001</div>
          <div style={{display:'flex', gap:'6px'}}>
            <div style={{background:'#FFD600', color:'#412402', fontSize:'10px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px'}}>Super hôte</div>
            <div style={{background:'rgba(255,255,255,0.25)', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px'}}>Finaliste S1</div>
          </div>
        </div>
      </div>
      <div style={{display:'flex', background:'#fff', borderBottom:'1.5px solid #FFE5D0'}}>
        {[['23','Repas'],['4.7','Note'],['87','Invités'],['340','Points']].map(([val, label]) => (
          <div key={label} style={{flex:1, padding:'12px 8px', textAlign:'center', borderRight:'1px solid #FFE5D0'}}>
            <div style={{fontSize:'18px', fontWeight:'800', color:'#FF6B35'}}>{val}</div>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#aaa', marginTop:'2px'}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'14px 16px'}}>
        <div style={{fontSize:'13px', fontWeight:'800', color:'#222', marginBottom:'12px'}}>Derniers avis reçus</div>
        <div style={{background:'#FFF8F0', borderRadius:'14px', padding:'12px', marginBottom:'10px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
            <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#FFE5D0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>👩</div>
            <div>
              <div style={{fontSize:'12px', fontWeight:'800', color:'#222'}}>Sophie M.</div>
              <div style={{color:'#FFD600', fontSize:'11px'}}>★★★★★</div>
            </div>
            <div style={{marginLeft:'auto', fontSize:'10px', color:'#aaa', fontWeight:'600'}}>28 mars</div>
          </div>
          <div style={{fontSize:'12px', color:'#555', fontWeight:'600', lineHeight:'1.5'}}>Soirée magique ! Le tajine était incroyable, Karim est un hôte chaleureux.</div>
        </div>
        <div style={{background:'#FFF8F0', borderRadius:'14px', padding:'12px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
            <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#E0F5E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>🧑</div>
            <div>
              <div style={{fontSize:'12px', fontWeight:'800', color:'#222'}}>Marco R.</div>
              <div style={{color:'#FFD600', fontSize:'11px'}}>★★★★★</div>
            </div>
            <div style={{marginLeft:'auto', fontSize:'10px', color:'#aaa', fontWeight:'600'}}>15 mars</div>
          </div>
          <div style={{fontSize:'12px', color:'#555', fontWeight:'600', lineHeight:'1.5'}}>Une table pleine de convivialité, des plats faits avec amour !</div>
        </div>
      </div>
    </div>
  )
}

function EcranConnexion({ setEcran, setUser }) {
  const [email, setEmail] = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [prenom, setPrenom] = useState('')
  const [erreur, setErreur] = useState('')
  const [mode, setMode] = useState('connexion')

  async function handleSubmit() {
    setErreur('')
    if (mode === 'inscription') {
      const { data, error } = await supabase.auth.signUp({ email, password: motdepasse })
      if (error) { setErreur(error.message) }
      else {
        await supabase.from('profils').insert({ id: data.user.id, prenom, ville: 'Marseille' })
        setErreur('Compte créé ! Tu peux te connecter.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: motdepasse })
      if (error) { setErreur('Email ou mot de passe incorrect') }
      else { setUser(data.user); setEcran('accueil') }
    }
  }

  return (
    <div style={{minHeight:'100vh', background:'#FFF8F0', display:'flex', flexDirection:'column'}}>
      <div style={{background:'#FF6B35', padding:'40px 24px 30px', textAlign:'center'}}>
        <div style={{fontFamily:'Pacifico, cursive', fontSize:'28px', color:'#fff', marginBottom:'8px'}}>Mange Chez Moi</div>
        <div style={{fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:'600'}}>Repas chez l'habitant à Marseille</div>
      </div>
      <div style={{padding:'24px 20px', flex:1}}>
        <div style={{display:'flex', background:'#FFE5D0', borderRadius:'12px', padding:'3px', marginBottom:'20px'}}>
          <div onClick={() => setMode('connexion')} style={{flex:1, padding:'8px', textAlign:'center', borderRadius:'10px', background: mode === 'connexion' ? '#FF6B35' : 'transparent', color: mode === 'connexion' ? '#fff' : '#888', fontSize:'13px', fontWeight:'700', cursor:'pointer'}}>Connexion</div>
          <div onClick={() => setMode('inscription')} style={{flex:1, padding:'8px', textAlign:'center', borderRadius:'10px', background: mode === 'inscription' ? '#FF6B35' : 'transparent', color: mode === 'inscription' ? '#fff' : '#888', fontSize:'13px', fontWeight:'700', cursor:'pointer'}}>Inscription</div>
        </div>

        {mode === 'inscription' && (
          <div style={{marginBottom:'14px'}}>
            <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.4px'}}>Prénom</div>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ton prénom" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'13px', outline:'none'}}/>
          </div>
        )}

        <div style={{marginBottom:'14px'}}>
          <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.4px'}}>Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ton@email.com" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'13px', outline:'none'}}/>
        </div>
        <div style={{marginBottom:'20px'}}>
          <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.4px'}}>Mot de passe</div>
          <input value={motdepasse} onChange={(e) => setMotdepasse(e.target.value)} type="password" placeholder="••••••••" style={{width:'100%', background:'#FFF8F0', border:'1.5px solid #FFE5D0', borderRadius:'12px', padding:'11px 13px', fontFamily:'Nunito, sans-serif', fontSize:'13px', outline:'none'}}/>
        </div>
        {erreur && <div style={{background:'#FFEDE5', color:'#D04A10', fontSize:'12px', fontWeight:'600', padding:'10px 12px', borderRadius:'10px', marginBottom:'14px'}}>{erreur}</div>}
        <div onClick={handleSubmit} style={{background:'#FF6B35', borderRadius:'14px', padding:'14px', textAlign:'center', fontSize:'14px', fontWeight:'800', color:'#fff', cursor:'pointer'}}>
          {mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [ecran, setEcran] = useState('accueil')
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })
  }, [])

  if (!user) {
    return <EcranConnexion setEcran={setEcran} setUser={setUser} />
  }

  return (
    <div>
      {ecran === 'accueil' && <EcranAccueil setEcran={setEcran} />}
      {ecran === 'chercher' && <EcranChercher setEcran={setEcran} user={user} />}
      {ecran === 'mesrepas' && <EcranMesRepas setEcran={setEcran} />}
      {ecran === 'creerrepas' && <EcranCreerRepas setEcran={setEcran} />}
      {ecran === 'classement' && <EcranClassement setEcran={setEcran} />}
      {ecran === 'profil' && <EcranProfil setEcran={setEcran} setUser={setUser} user={user} />}
      <Nav ecran={ecran} setEcran={setEcran} />
    </div>
  )
}

export default App