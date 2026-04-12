import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

async function uploadPhoto(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'mange_chez_moi')
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  )
  const data = await res.json()
  return data.secure_url
}

function CarteRepas({ emoji, titre, date, couleur, badge, couleurBadge, photoUrl }) {
  return (
    <div
      style={{
        minWidth: '130px',
        background: '#fff',
        borderRadius: '16px',
        border: '1.5px solid #FFE5D0',
        overflow: 'hidden',
        marginBottom: '10px',
      }}
    >
      {photoUrl ? (
        <img src={photoUrl} style={{ width: '100%', height: '72px', objectFit: 'cover' }} />
      ) : (
        <div
          style={{
            height: '72px',
            background: couleur,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
          }}
        >
          {emoji}
        </div>
      )}
      <div style={{ padding: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#222' }}>{titre}</div>
        <div style={{ fontSize: '10px', color: '#888', fontWeight: '600' }}>{date}</div>
        <div
          style={{
            fontSize: '9px',
            fontWeight: '700',
            padding: '2px 6px',
            borderRadius: '20px',
            background: couleurBadge,
            color: '#D04A10',
            display: 'inline-block',
            marginTop: '4px',
          }}
        >
          {badge}
        </div>
      </div>
    </div>
  )
}

function Nav({ ecran, setEcran }) {
  return (
    <div
      style={{
        background: '#fff',
        borderTop: '1.5px solid #FFE5D0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0 14px',
        position: 'sticky',
        bottom: '0',
      }}
    >
      {[
        ['🏠', 'accueil'],
        ['🔍', 'chercher'],
        ['🍽️', 'mesrepas'],
        ['🏆', 'classement'],
        ['👤', 'profil'],
      ].map(([icon, nom]) => (
        <div
          key={nom}
          onClick={() => setEcran(nom)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: ecran === nom ? '#FFE5D0' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: '700',
              color: ecran === nom ? '#FF6B35' : '#bbb',
            }}
          >
            {nom}
          </div>
        </div>
      ))}
    </div>
  )
}

function EcranAccueil({ setEcran, user }) {
  const [repas, setRepas] = useState([])
  const [profil, setProfil] = useState(null)
  const [stats, setStats] = useState({ repas: 0, membres: 0, messages: 0 })

  useEffect(() => {
    async function chargerDonnees() {
      const { data: repasData } = await supabase
        .from('repas')
        .select('*')
        .order('id', { ascending: false })
        .limit(5)
      if (repasData) setRepas(repasData)
      const { data: profilData } = await supabase
        .from('profils')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profilData) setProfil(profilData)
      const { count: nbRepas } = await supabase
        .from('repas')
        .select('*', { count: 'exact', head: true })
      const { count: nbMembres } = await supabase
        .from('profils')
        .select('*', { count: 'exact', head: true })
      const { count: nbMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
      setStats({ repas: nbRepas || 0, membres: nbMembres || 0, messages: nbMessages || 0 })
    }
    chargerDonnees()
  }, [])

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '10px 16px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '22px', color: '#fff' }}>
            Mange Chez Moi
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div
              onClick={() => setEcran('notifications')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '20px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '16px' }}>🔔</span>
              {stats.repas > 0 && (
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#fff' }}>
                  {stats.repas > 9 ? '9+' : stats.repas}
                </span>
              )}
            </div>
            <div
              onClick={() => setEcran('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '20px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '16px' }}>💬</span>
              {stats.messages > 0 && (
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#fff' }}>
                  {stats.messages > 9 ? '9+' : stats.messages}
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
            Bonjour {profil?.prenom || 'toi'} 👋
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
            Que manges-tu ce soir ?
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>{stats.repas}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
              Repas
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              {stats.membres}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
              Membres
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>🇫🇷</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
              France
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: '800' }}>Repas à venir</span>
          <span
            onClick={() => setEcran('chercher')}
            style={{ fontSize: '11px', fontWeight: '700', color: '#FF6B35', cursor: 'pointer' }}
          >
            Tout voir
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          {repas.map((r) => (
            <CarteRepas
              key={r.id}
              emoji={r.emoji}
              titre={r.titre}
              date={r.date}
              couleur={r.couleur}
              badge={r.badge}
              couleurBadge={r.couleur}
              photoUrl={r.photo_url}
            />
          ))}
        </div>
      </div>
      <div style={{ background: '#F7F2EC', padding: '14px 16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>
          La communauté
        </div>
        <div
          onClick={() => setEcran('creerrepas')}
          style={{
            background: '#FF6B35',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '24px' }}>🍳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>
              Organise un repas chez toi
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
              3-4 invités · tu fixes le prix
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>›</span>
        </div>
        {repas.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#fff',
              borderRadius: '18px',
              border: '1.5px solid #FFE5D0',
              overflow: 'hidden',
              marginBottom: '10px',
            }}
          >
            {r.photo_url ? (
              <img
                src={r.photo_url}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  height: '150px',
                  background: r.couleur,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                }}
              >
                {r.emoji}
              </div>
            )}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '4px' }}>
                {r.titre}
              </div>
              <div
                style={{ fontSize: '11px', color: '#888', fontWeight: '600', marginBottom: '6px' }}
              >
                {r.ville && <span>📍{r.ville} · </span>}
                {r.date} · {r.prix} €/pers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#D04A10',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    background: '#FFEDE5',
                  }}
                >
                  {r.badge}
                </div>
                <div
                  onClick={() => setEcran('chercher')}
                  style={{
                    marginLeft: 'auto',
                    background: '#FF6B35',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                  }}
                >
                  Réserver
                </div>
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            borderTop: '1px solid #FFE5D0',
            marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span
              onClick={() => setEcran('cgu')}
              style={{
                fontSize: '11px',
                color: '#aaa',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              CGU
            </span>
            <span
              onClick={() => setEcran('mentions')}
              style={{
                fontSize: '11px',
                color: '#aaa',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Mentions légales
            </span>
            <span
              onClick={() => setEcran('confidentialite')}
              style={{
                fontSize: '11px',
                color: '#aaa',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Confidentialité
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#ccc', marginTop: '6px' }}>
            © 2026 Mange Chez Moi
          </div>
        </div>
      </div>
    </div>
  )
}

function EcranChercher({ setEcran, user, onChatRepas }) {
  const [repas, setRepas] = useState([])
  const [mesReservations, setMesReservations] = useState([])
  const [erreur, setErreur] = useState('')
  const [message, setMessage] = useState('')
  const [filtreVille, setFiltreVille] = useState('')

  useEffect(() => {
    async function chargerDonnees() {
      const { data, error } = await supabase
        .from('repas')
        .select('*')
        .order('id', { ascending: false })
      if (error) {
        setErreur(error.message)
      } else {
        setRepas(data)
      }
      const { data: resData } = await supabase
        .from('reservations')
        .select('repas_id')
        .eq('user_id', user.id)
      if (resData) setMesReservations(resData.map((r) => r.repas_id))
    }
    chargerDonnees()
  }, [])

  async function reserver(repasId) {
    const { error } = await supabase
      .from('reservations')
      .insert({ repas_id: repasId, user_id: user.id })
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Réservation confirmée ! 🎉')
      setMesReservations([...mesReservations, repasId])
    }
  }

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '10px 16px 16px' }}>
        <div
          style={{
            fontFamily: 'Pacifico, cursive',
            fontSize: '18px',
            color: '#fff',
            marginBottom: '10px',
          }}
        >
          Trouver un repas
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 12px',
          }}
        >
          <span style={{ fontSize: '15px' }}>🔍</span>
          <input
            value={filtreVille}
            onChange={(e) => setFiltreVille(e.target.value)}
            placeholder="Rechercher une ville..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              background: 'transparent',
            }}
          />
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {erreur && (
          <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{erreur}</div>
        )}
        {message && (
          <div
            style={{
              background: '#E0F5E8',
              color: '#085041',
              fontSize: '12px',
              fontWeight: '600',
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '10px',
            }}
          >
            {message}
          </div>
        )}
        <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>
          {repas.length} repas disponibles
        </div>
        {repas
          .filter(
            (r) =>
              !filtreVille ||
              (r.ville && r.ville.toLowerCase().includes(filtreVille.toLowerCase())),
          )
          .map((r) => (
            <div
              key={r.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1.5px solid #FFE5D0',
                overflow: 'hidden',
                marginBottom: '10px',
              }}
            >
              {r.photo_url ? (
                <img
                  src={r.photo_url}
                  style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    height: '72px',
                    background: r.couleur,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                  }}
                >
                  {r.emoji}
                </div>
              )}
              <div style={{ padding: '10px 12px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#222',
                    marginBottom: '2px',
                  }}
                >
                  {r.titre}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#888',
                    fontWeight: '600',
                    marginBottom: '6px',
                  }}
                >
                  {r.ville && <span>📍{r.ville} · </span>}
                  {r.date} · {r.prix} €/pers
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '20px',
                      background: r.couleur,
                      color: '#D04A10',
                    }}
                  >
                    {r.badge}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div
                      onClick={() => onChatRepas(r.id)}
                      style={{
                        background: '#EDE0FF',
                        color: '#6B35FF',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      💬
                    </div>
                    <div
                      onClick={() => !mesReservations.includes(r.id) && reserver(r.id)}
                      style={{
                        background: mesReservations.includes(r.id) ? '#E0F5E8' : '#FF6B35',
                        color: mesReservations.includes(r.id) ? '#085041' : '#fff',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: mesReservations.includes(r.id) ? 'default' : 'pointer',
                      }}
                    >
                      {mesReservations.includes(r.id) ? 'Réservé ✓' : 'Réserver'}
                    </div>
                  </div>
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
  const [photo, setPhoto] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [ville, setVille] = useState('')

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(URL.createObjectURL(file))
    const url = await uploadPhoto(file)
    setPhotoUrl(url)
  }

  async function creerRepas() {
    if (!titre || !date) {
      setMessage('Remplis le titre et la date !')
      return
    }
    const { error } = await supabase.from('repas').insert({
      titre,
      emoji,
      date,
      places,
      prix,
      couleur: '#FFECD0',
      badge: places + ' places dispo',
      photo_url: photoUrl,
      ville,
    })
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Repas créé !')
      setEcran('chercher')
    }
  }

  return (
    <div>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#fff' }}>
          Nouveau repas
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Emoji du plat
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['🍽️', '🥘', '🍜', '🍕', '🫕', '🍲', '🥗', '🍣'].map((e) => (
              <div
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: emoji === e ? '#FFE5D0' : '#f5f5f5',
                  border: emoji === e ? '2px solid #FF6B35' : '1.5px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Titre du repas
          </div>
          <input
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex: Tajine maison aux pruneaux"
            style={{
              width: '100%',
              background: '#FFF8F0',
              border: '1.5px solid #FFE5D0',
              borderRadius: '12px',
              padding: '11px 13px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Ville
          </div>
          <input
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ex: Paris, Lyon, Bordeaux..."
            style={{
              width: '100%',
              background: '#FFF8F0',
              border: '1.5px solid #FFE5D0',
              borderRadius: '12px',
              padding: '11px 13px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Date & heure
          </div>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Ex: Sam. 5 avr. · 19h"
            style={{
              width: '100%',
              background: '#FFF8F0',
              border: '1.5px solid #FFE5D0',
              borderRadius: '12px',
              padding: '11px 13px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#888',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Nb invités
            </div>
            <input
              type="number"
              value={places}
              onChange={(e) => setPlaces(Number(e.target.value))}
              min="1"
              max="8"
              style={{
                width: '100%',
                background: '#FFF8F0',
                border: '1.5px solid #FFE5D0',
                borderRadius: '12px',
                padding: '11px 13px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '16px',
                fontWeight: '800',
                color: '#FF6B35',
                outline: 'none',
                textAlign: 'center',
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#888',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Prix (€)
            </div>
            <input
              type="number"
              value={prix}
              onChange={(e) => setPrix(Number(e.target.value))}
              min="0"
              style={{
                width: '100%',
                background: '#FFF8F0',
                border: '1.5px solid #FFE5D0',
                borderRadius: '12px',
                padding: '11px 13px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '16px',
                fontWeight: '800',
                color: '#FF6B35',
                outline: 'none',
                textAlign: 'center',
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Photo du plat
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ width: '100%', fontSize: '12px' }}
          />
          {photo && (
            <img
              src={photo}
              style={{
                width: '100%',
                borderRadius: '12px',
                marginTop: '8px',
                height: '150px',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
        {message && (
          <div
            style={{
              background: message === 'Repas créé !' ? '#E0F5E8' : '#FFEDE5',
              color: message === 'Repas créé !' ? '#085041' : '#D04A10',
              fontSize: '12px',
              fontWeight: '600',
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '14px',
            }}
          >
            {message}
          </div>
        )}
        <div
          onClick={creerRepas}
          style={{
            background: '#FF6B35',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '800',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Publier mon repas 🎉
        </div>
      </div>
    </div>
  )
}

function EcranMesRepas({ setEcran, user, setRepasSelectionne }) {
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    async function chargerReservations() {
      const { data } = await supabase
        .from('reservations')
        .select('*, repas(*)')
        .eq('user_id', user.id)
      if (data) setReservations(data)
    }
    chargerReservations()
  }, [])

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '10px 16px 14px' }}>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#fff' }}>
          Mes repas
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div
          onClick={() => setEcran('creerrepas')}
          style={{
            background: '#FF6B35',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '24px' }}>🍳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>
              Organiser un nouveau repas
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
              3-4 invités · tu fixes le prix
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>›</span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>
          Mes réservations ({reservations.length})
        </div>
        {reservations.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
              borderBottom: '1px solid #FFE5D0',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: r.repas?.couleur || '#FFE5D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0,
              }}
            >
              {r.repas?.photo_url ? (
                <img
                  src={r.repas.photo_url}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                r.repas?.emoji || '🍽️'
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>
                {r.repas?.titre}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', marginTop: '2px' }}>
                {r.repas?.ville && <span>📍{r.repas.ville} · </span>}
                {r.repas?.date} · {r.repas?.prix} €/pers
              </div>
            </div>
            <div
              onClick={() => {
                setRepasSelectionne(r.repas_id)
                setEcran('notation')
              }}
              style={{
                background: '#EEEDFE',
                color: '#3C3489',
                fontSize: '10px',
                fontWeight: '700',
                padding: '5px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
            >
              Noter ⭐
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcranNotation({ setEcran, user, repasId }) {
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [message, setMessage] = useState('')

  async function noter() {
    if (note === 0) {
      setMessage('Choisis une note !')
      return
    }
    const { error } = await supabase
      .from('notations')
      .insert({ repas_id: repasId, noteur_id: user.id, note, commentaire })
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Merci pour ta note ! 🎉')
      setTimeout(() => setEcran('mesrepas'), 2000)
    }
  }

  return (
    <div>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('mesrepas')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#fff' }}>
          Noter ce repas
        </span>
      </div>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#222', marginBottom: '16px' }}>
            Quelle note donnes-tu à ce repas ?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                onClick={() => setNote(n)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: note >= n ? '#FFD600' : '#f5f5f5',
                  border: note >= n ? '2px solid #EF9F27' : '1.5px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  cursor: 'pointer',
                }}
              >
                ★
              </div>
            ))}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#FF6B35', marginTop: '10px' }}>
            {note === 0
              ? 'Clique sur une étoile'
              : note === 1
                ? 'Décevant 😕'
                : note === 2
                  ? 'Peut mieux faire 😐'
                  : note === 3
                    ? 'Correct 🙂'
                    : note === 4
                      ? 'Très bien 😊'
                      : 'Excellent ! 🤩'}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Ton commentaire
          </div>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Décris ton expérience..."
            style={{
              width: '100%',
              background: '#FFF8F0',
              border: '1.5px solid #FFE5D0',
              borderRadius: '12px',
              padding: '11px 13px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              minHeight: '100px',
            }}
          />
        </div>
        {message && (
          <div
            style={{
              background: message.includes('Merci') ? '#E0F5E8' : '#FFEDE5',
              color: message.includes('Merci') ? '#085041' : '#D04A10',
              fontSize: '12px',
              fontWeight: '600',
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '14px',
            }}
          >
            {message}
          </div>
        )}
        <div
          onClick={noter}
          style={{
            background: '#FF6B35',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '800',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Envoyer ma note ⭐
        </div>
      </div>
    </div>
  )
}

function EcranClassement({ setEcran }) {
  const [joueurs, setJoueurs] = useState([])
  const [membreSelectionne, setMembreSelectionne] = useState(null)

  useEffect(() => {
    async function chargerClassement() {
      const { data } = await supabase.from('classement_view').select('*')
      if (data) setJoueurs(data)
    }
    chargerClassement()
  }, [])

  if (membreSelectionne)
    return (
      <div>
        <div style={{ background: '#FF6B35', padding: '10px 16px 24px' }}>
          <div
            onClick={() => setMembreSelectionne(null)}
            style={{ color: '#fff', fontSize: '18px', cursor: 'pointer', marginBottom: '10px' }}
          >
            ←
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#FFE5D0',
                border: '3px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}
            >
              👤
            </div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>
              {membreSelectionne.prenom || 'Anonyme'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
              📍 {membreSelectionne.ville || 'France'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', background: '#fff', borderBottom: '1.5px solid #FFE5D0' }}>
          <div style={{ flex: 1, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FF6B35' }}>
              {Math.round(membreSelectionne.total_pts)}
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', marginTop: '2px' }}>
              Points
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '10px 16px 14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#fff' }}>
            Classement
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#fff',
            }}
          >
            Manche 4 · Avr.
          </div>
        </div>
        <div
          style={{
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>
            Fin de manche dans
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>12 jours</span>
        </div>
      </div>
      <div style={{ padding: '8px 16px' }}>
        {joueurs.map((j, index) => (
          <div
            key={j.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 0',
              borderBottom: '1px solid #FFE5D0',
            }}
          >
            <div
              style={{
                width: '26px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '800',
                color:
                  index === 0
                    ? '#854F0B'
                    : index === 1
                      ? '#5F5E5A'
                      : index === 2
                        ? '#993C1D'
                        : '#aaa',
              }}
            >
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
            </div>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FFE5D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              👤
            </div>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setMembreSelectionne(j)}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#FF6B35' }}>
                {j.prenom || 'Anonyme'}
              </div>
              <div style={{ fontSize: '10px', color: '#888', fontWeight: '600' }}>
                📍 {j.ville || 'France'}
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#FF6B35' }}>
              {Math.round(j.total_pts)} pts
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          margin: '10px 16px',
          background: '#222',
          borderRadius: '16px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '28px' }}>🏆</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFD600' }}>
            Grande Finale — Mois 5
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '600',
              marginTop: '2px',
            }}
          >
            Top 3 cette manche → qualifiés
          </div>
        </div>
        <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>›</span>
      </div>
    </div>
  )
}

function EcranProfil({ setEcran, setUser, user }) {
  const [profil, setProfil] = useState(null)
  const [notations, setNotations] = useState([])
  const [moyenne, setMoyenne] = useState(0)

  useEffect(() => {
    async function chargerProfil() {
      const { data } = await supabase.from('profils').select('*').eq('id', user.id).single()
      setProfil(data)
      const { data: notes } = await supabase.from('notations').select('*').eq('noteur_id', user.id)
      if (notes && notes.length > 0) {
        setNotations(notes)
        setMoyenne((notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(1))
      }
    }
    chargerProfil()
  }, [])

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '10px 16px 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '17px', color: '#fff' }}>
            Mon profil
          </span>
          {user.id === 'd89917e9-93b3-40a8-aca2-54627992354b' && (
            <div
              onClick={() => setEcran('admin')}
              style={{
                background: 'rgba(255,214,0,0.3)',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
                marginRight: '6px',
              }}
            >
              🔧 Admin
            </div>
          )}
          <div
            onClick={async () => {
              await supabase.auth.signOut()
              setUser(null)
            }}
            style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Déconnexion
          </div>
          <div
            onClick={async () => {
              const confirmation = window.prompt('Pour supprimer ton compte, tape SUPPRIMER')
              if (confirmation === 'SUPPRIMER') {
                await supabase.rpc('delete_user')
                await supabase.auth.signOut()
                setUser(null)
              } else if (confirmation !== null) {
                window.alert('Texte incorrect, suppression annulée.')
              }
            }}
            style={{
              background: 'rgba(255,0,0,0.2)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            🗑️ Supprimer
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            {profil?.photo_url ? (
              <img
                src={profil.photo_url}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#FFE5D0',
                  border: '3px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}
              >
                👨
              </div>
            )}
            <label
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: '#FF6B35',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              📷
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (!file) return
                  const url = await uploadPhoto(file)
                  await supabase.from('profils').update({ photo_url: url }).eq('id', user.id)
                  setProfil({ ...profil, photo_url: url })
                }}
              />
            </label>
          </div>
          <div style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>
            {profil?.prenom || user?.email}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
            📍 {profil?.ville || 'France'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1.5px solid #FFE5D0' }}>
        {[
          ['?', 'Repas'],
          [moyenne || '?', 'Note'],
          [notations.length, 'Avis'],
          ['0', 'Points'],
        ].map(([val, label]) => (
          <div
            key={label}
            style={{
              flex: 1,
              padding: '12px 8px',
              textAlign: 'center',
              borderRight: '1px solid #FFE5D0',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FF6B35' }}>{val}</div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', marginTop: '2px' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>
          Mes derniers avis donnés
        </div>
        {notations.length === 0 && (
          <div style={{ fontSize: '12px', color: '#aaa', fontWeight: '600' }}>
            Tu n'as pas encore donné d'avis.
          </div>
        )}
        {notations.slice(0, 3).map((n) => (
          <div
            key={n.id}
            style={{
              background: '#FFF8F0',
              borderRadius: '14px',
              padding: '12px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ color: '#FFD600', fontSize: '14px' }}>
                {'★'.repeat(n.note)}
                {'☆'.repeat(5 - n.note)}
              </div>
              <div
                style={{ marginLeft: 'auto', fontSize: '10px', color: '#aaa', fontWeight: '600' }}
              >
                {new Date(n.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#555', fontWeight: '600', lineHeight: '1.5' }}>
              {n.commentaire || 'Pas de commentaire'}
            </div>
          </div>
        ))}
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
  const [voirMdp, setVoirMdp] = useState(false)

  async function handleSubmit() {
    setErreur('')
    if (mode === 'inscription') {
      const { data, error } = await supabase.auth.signUp({ email, password: motdepasse })
      if (error) {
        setErreur(error.message)
      } else {
        await supabase.from('profils').insert({ id: data.user.id, prenom, ville: 'France' })
        setErreur('Compte créé ! Tu peux te connecter.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: motdepasse,
      })
      if (error) {
        setErreur('Email ou mot de passe incorrect')
      } else {
        setUser(data.user)
        setEcran('accueil')
      }
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFF8F0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ background: '#FF6B35', padding: '40px 24px 30px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'Pacifico, cursive',
            fontSize: '28px',
            color: '#fff',
            marginBottom: '8px',
          }}
        >
          Mange Chez Moi
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
          Repas chez l'habitant en France
        </div>
      </div>
      <div style={{ padding: '24px 20px', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            background: '#FFE5D0',
            borderRadius: '12px',
            padding: '3px',
            marginBottom: '20px',
          }}
        >
          <div
            onClick={() => setMode('connexion')}
            style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              borderRadius: '10px',
              background: mode === 'connexion' ? '#FF6B35' : 'transparent',
              color: mode === 'connexion' ? '#fff' : '#888',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Connexion
          </div>
          <div
            onClick={() => setMode('inscription')}
            style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              borderRadius: '10px',
              background: mode === 'inscription' ? '#FF6B35' : 'transparent',
              color: mode === 'inscription' ? '#fff' : '#888',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Inscription
          </div>
        </div>
        {mode === 'inscription' && (
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#888',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              Prénom
            </div>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              style={{
                width: '100%',
                background: '#FFF8F0',
                border: '1.5px solid #FFE5D0',
                borderRadius: '12px',
                padding: '11px 13px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        )}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Email
          </div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            style={{
              width: '100%',
              background: '#FFF8F0',
              border: '1.5px solid #FFE5D0',
              borderRadius: '12px',
              padding: '11px 13px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Mot de passe
          </div>
          <div style={{ position: 'relative' }}>
            <input
              value={motdepasse}
              onChange={(e) => setMotdepasse(e.target.value)}
              type={voirMdp ? 'text' : 'password'}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: '#FFF8F0',
                border: '1.5px solid #FFE5D0',
                borderRadius: '12px',
                padding: '11px 13px',
                paddingRight: '40px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <div
              onClick={() => setVoirMdp(!voirMdp)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {voirMdp ? '🙈' : '👁️'}
            </div>
          </div>
        </div>
        {erreur && (
          <div
            style={{
              background: '#FFEDE5',
              color: '#D04A10',
              fontSize: '12px',
              fontWeight: '600',
              padding: '10px 12px',
              borderRadius: '10px',
              marginBottom: '14px',
            }}
          >
            {erreur}
          </div>
        )}
        <div
          onClick={handleSubmit}
          style={{
            background: '#FF6B35',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '800',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
        </div>
      </div>
    </div>
  )
}

function EcranChat({ setEcran, user }) {
  const [messages, setMessages] = useState([])
  const [texte, setTexte] = useState('')
  const [profil, setProfil] = useState(null)
  const messagesRef = useRef(null)
  const [messageSelectionne, setMessageSelectionne] = useState(null)

  useEffect(() => {
    async function charger() {
      const { data: p } = await supabase.from('profils').select('*').eq('id', user.id).single()
      setProfil(p)
      const { data: m } = await supabase
        .from('messages')
        .select('*')
        .is('repas_id', null)
        .order('created_at', { ascending: true })
      if (m) setMessages(m)
    }
    charger()
    const canal = supabase
      .channel('messages-global-' + Date.now())
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (!payload.new.repas_id) {
            setMessages((prev) => [...prev, payload.new])
          }
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(canal)
    }
  }, [])

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  async function envoyer() {
    if (!texte.trim()) return
    await supabase.from('messages').insert({ user_id: user.id, contenu: texte, repas_id: null })
    setTexte('')
  }

  async function vider() {
    if (window.confirm('Effacer tous les messages ?')) {
      await supabase.from('messages').delete().is('repas_id', null)
      setMessages([])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#fff', flex: 1 }}>
          Chat communauté 💬
        </span>
      </div>
      {messageSelectionne && (
        <div
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: '#fff',
            borderRadius: '20px 20px 0 0',
            padding: '16px',
            zIndex: 100,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#888',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            Mon message
          </div>
          <div
            style={{
              background: '#FFF8F0',
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '13px',
              color: '#222',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            {messageSelectionne.contenu}
          </div>
          <div
            onClick={async () => {
              const nouveau = messageSelectionne.contenu
              setMessageSelectionne({ ...messageSelectionne, modifier: true })
            }}
            style={{
              background: '#FF6B35',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            ✏️ Modifier
          </div>
          {messageSelectionne.modifier && (
            <div style={{ marginBottom: '8px' }}>
              <input
                defaultValue={messageSelectionne.contenu}
                id="input-modifier"
                style={{
                  width: '100%',
                  background: '#FFF8F0',
                  border: '1.5px solid #FFE5D0',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <div
                onClick={async () => {
                  const nouveau = document.getElementById('input-modifier').value
                  if (nouveau && nouveau.trim()) {
                    await supabase
                      .from('messages')
                      .update({ contenu: nouveau })
                      .eq('id', messageSelectionne.id)
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === messageSelectionne.id ? { ...msg, contenu: nouveau } : msg,
                      ),
                    )
                    setMessageSelectionne(null)
                  }
                }}
                style={{
                  background: '#4CAF50',
                  borderRadius: '12px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#fff',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                ✅ Valider
              </div>
            </div>
          )}
          <div
            onClick={async () => {
              await supabase.from('messages').delete().eq('id', messageSelectionne.id)
              setMessages((prev) => prev.filter((msg) => msg.id !== messageSelectionne.id))
              setMessageSelectionne(null)
            }}
            style={{
              background: '#FF3B30',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            🗑️ Supprimer
          </div>
          <div
            onClick={() => setMessageSelectionne(null)}
            style={{
              background: '#f5f5f5',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#888',
              cursor: 'pointer',
            }}
          >
            Annuler
          </div>
        </div>
      )}
      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            marginBottom: '12px',
            display: 'flex',
            flexDirection: m.user_id === user.id ? 'row-reverse' : 'row',
            gap: '8px',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#FFE5D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#aaa',
                fontWeight: '600',
                marginBottom: '2px',
                textAlign: m.user_id === user.id ? 'right' : 'left',
              }}
            >
              {m.user_id === user.id ? profil?.prenom || 'Moi' : 'Membre'}
            </div>
            <div
              onClick={() => {
                if (m.user_id === user.id) setMessageSelectionne(m)
              }}
              style={{
                background: m.user_id === user.id ? '#FF6B35' : '#fff',
                color: m.user_id === user.id ? '#fff' : '#222',
                borderRadius: '14px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: '600',
                border: '1.5px solid #FFE5D0',
                maxWidth: '220px',
                cursor: m.user_id === user.id ? 'pointer' : 'default',
              }}
            >
              {m.contenu}
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          padding: '10px 16px',
          background: '#fff',
          borderTop: '1.5px solid #FFE5D0',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && envoyer()}
          placeholder="Ton message..."
          style={{
            flex: 1,
            background: '#FFF8F0',
            border: '1.5px solid #FFE5D0',
            borderRadius: '20px',
            padding: '10px 14px',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <div
          onClick={envoyer}
          style={{
            background: '#FF6B35',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ➤
        </div>
      </div>
    </div>
  )
}

function EcranNotifications({ setEcran }) {
  const [repas, setRepas] = useState([])

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from('repas')
        .select('*')
        .order('id', { ascending: false })
        .limit(10)
      if (data) setRepas(data)
    }
    charger()
  }, [])

  return (
    <div>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#fff' }}>
          Notifications 🔔
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {repas.length === 0 && (
          <div style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
            Aucune notification
          </div>
        )}
        {repas.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#fff',
              borderRadius: '14px',
              border: '1.5px solid #FFE5D0',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: r.couleur,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0,
              }}
            >
              {r.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>
                Nouveau repas 🍽️
              </div>
              <div style={{ fontSize: '12px', color: '#555', fontWeight: '600' }}>{r.titre}</div>
              <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '600' }}>
                📍 {r.ville || 'France'} · {r.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcranChatRepas({ setEcran, user, repasId }) {
  const [messages, setMessages] = useState([])
  const [texte, setTexte] = useState('')
  const [profil, setProfil] = useState(null)
  const [repas, setRepas] = useState(null)
  const messagesRef = useRef(null)

  useEffect(() => {
    if (!repasId) return
    async function charger() {
      const { data: p } = await supabase.from('profils').select('*').eq('id', user.id).single()
      setProfil(p)
      const { data: r } = await supabase.from('repas').select('*').eq('id', repasId).single()
      setRepas(r)
      const { data: m } = await supabase
        .from('messages')
        .select('*')
        .eq('repas_id', repasId)
        .order('created_at', { ascending: true })
      if (m) setMessages(m)
    }
    charger()
    const canal = supabase
      .channel('messages-repas-' + repasId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `repas_id=eq.${repasId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(canal)
    }
  }, [repasId])

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  async function envoyer() {
    if (!texte.trim()) return
    await supabase.from('messages').insert({ user_id: user.id, contenu: texte, repas_id: repasId })
    setTexte('')
  }

  if (!repasId) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('chercher')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '16px', color: '#fff' }}>
            Chat 💬
          </span>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
            {repas?.titre}
          </div>
        </div>
      </div>
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '40px' }}>
            Aucun message — soyez le premier ! 👋
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: '12px',
              display: 'flex',
              flexDirection: m.user_id === user.id ? 'row-reverse' : 'row',
              gap: '8px',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#FFE5D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              👤
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#aaa',
                  fontWeight: '600',
                  marginBottom: '2px',
                  textAlign: m.user_id === user.id ? 'right' : 'left',
                }}
              >
                {m.user_id === user.id ? profil?.prenom || 'Moi' : 'Membre'}
              </div>
              <div
                style={{
                  background: m.user_id === user.id ? '#FF6B35' : '#fff',
                  color: m.user_id === user.id ? '#fff' : '#222',
                  borderRadius: '14px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1.5px solid #FFE5D0',
                  maxWidth: '220px',
                }}
              >
                {m.contenu}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: '10px 16px',
          background: '#fff',
          borderTop: '1.5px solid #FFE5D0',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && envoyer()}
          placeholder="Ton message..."
          style={{
            flex: 1,
            background: '#FFF8F0',
            border: '1.5px solid #FFE5D0',
            borderRadius: '20px',
            padding: '10px 14px',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <div
          onClick={envoyer}
          style={{
            background: '#FF6B35',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ➤
        </div>
      </div>
    </div>
  )
}

function EcranCGU({ setEcran }) {
  return (
    <div>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '16px', color: '#fff' }}>
          CGU
        </span>
      </div>
      <div style={{ padding: '16px', fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#222' }}>
          Conditions Générales d'Utilisation
        </h2>
        <p>
          <strong>Dernière mise à jour :</strong> Avril 2026
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          1. Objet
        </h3>
        <p>
          Mange Chez Moi est une plateforme de mise en relation entre hôtes proposant des repas
          faits maison et des convives. L'utilisation de l'application implique l'acceptation des
          présentes CGU.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          2. Inscription
        </h3>
        <p>
          L'accès à l'application nécessite la création d'un compte avec une adresse email valide.
          L'utilisateur est responsable de la confidentialité de ses identifiants.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          3. Responsabilités
        </h3>
        <p>
          Mange Chez Moi est une plateforme de mise en relation. Elle n'est pas responsable de la
          qualité des repas, des relations entre utilisateurs, ni des transactions effectuées en
          dehors de la plateforme.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          4. Comportement
        </h3>
        <p>
          Les utilisateurs s'engagent à respecter les autres membres, à ne pas publier de contenu
          offensant ou illégal, et à utiliser l'application de bonne foi.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          5. Données personnelles
        </h3>
        <p>
          Les données collectées sont utilisées uniquement dans le cadre du fonctionnement de
          l'application. Elles ne sont pas revendues à des tiers.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          6. Résiliation
        </h3>
        <p>
          L'utilisateur peut supprimer son compte à tout moment en contactant
          scorpio13860@hotmail.fr. Mange Chez Moi se réserve le droit de suspendre un compte en cas
          de non-respect des CGU.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          7. Droit applicable
        </h3>
        <p>
          Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux
          compétents de France.
        </p>
      </div>
    </div>
  )
}

function EcranMentions({ setEcran }) {
  return (
    <div>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '16px', color: '#fff' }}>
          Mentions légales
        </span>
      </div>
      <div style={{ padding: '16px', fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#222' }}>
          Mentions Légales
        </h2>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Éditeur
        </h3>
        <p>
          Romera Romain
          <br />
          914 boulevard de la Coopérative
          <br />
          13610 Le Puy Sainte Réparade
          <br />
          Email : scorpio13860@hotmail.fr
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Hébergement
        </h3>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Ave #4133
          <br />
          Covina, CA 91723, États-Unis
          <br />
          vercel.com
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Base de données
        </h3>
        <p>Supabase Inc. — supabase.com</p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Propriété intellectuelle
        </h3>
        <p>
          L'ensemble du contenu de l'application Mange Chez Moi est protégé par le droit d'auteur.
          Toute reproduction est interdite sans autorisation préalable.
        </p>
      </div>
    </div>
  )
}

function EcranConfidentialite({ setEcran }) {
  return (
    <div>
      <div
        style={{
          background: '#FF6B35',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico, cursive', fontSize: '16px', color: '#fff' }}>
          Confidentialité
        </span>
      </div>
      <div style={{ padding: '16px', fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#222' }}>
          Politique de Confidentialité
        </h2>
        <p>
          <strong>Dernière mise à jour :</strong> Avril 2026
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Données collectées
        </h3>
        <p>
          Mange Chez Moi collecte les données suivantes : adresse email, prénom, ville, photo de
          profil, repas créés, réservations effectuées, messages envoyés.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Utilisation des données
        </h3>
        <p>
          Ces données sont utilisées uniquement pour le fonctionnement de l'application : affichage
          du profil, gestion des réservations, classement communautaire.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Partage des données
        </h3>
        <p>
          Vos données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Cookies
        </h3>
        <p>
          L'application utilise des cookies de session pour maintenir votre connexion. Aucun cookie
          publicitaire n'est utilisé.
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Vos droits (RGPD)
        </h3>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression
          de vos données. Pour exercer ces droits, contactez : scorpio13860@hotmail.fr
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '14px 0 6px', color: '#FF6B35' }}>
          Conservation
        </h3>
        <p>
          Les données sont conservées tant que votre compte est actif. En cas de suppression, elles
          sont effacées dans un délai de 30 jours.
        </p>
      </div>
    </div>
  )
}
function EcranAdmin({ setEcran, user }) {
  const [messages, setMessages] = useState([])
  const [utilisateurs, setUtilisateurs] = useState([])
  const [onglet, setOnglet] = useState('messages')

  useEffect(() => {
    async function charger() {
      const { data: m } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (m) setMessages(m)
      const { data: u } = await supabase.from('profils').select('*')
      if (u) setUtilisateurs(u)
    }
    charger()

    const canal = supabase
      .channel('admin-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        charger()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [])

  async function supprimerMessage(id) {
    await supabase.from('messages').delete().eq('id', id)
    setMessages(messages.filter((m) => m.id !== id))
  }

  async function viderToutChat() {
    if (window.confirm('Vider tous les messages ?')) {
      await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      setMessages([])
    }
  }

  return (
    <div>
      <div
        style={{
          background: '#222',
          padding: '10px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span
          style={{ fontFamily: 'Pacifico, cursive', fontSize: '18px', color: '#FFD600', flex: 1 }}
        >
          Panel Admin 🔧
        </span>
      </div>
      <div style={{ display: 'flex', background: '#333', padding: '4px' }}>
        <div
          onClick={() => setOnglet('messages')}
          style={{
            flex: 1,
            padding: '8px',
            textAlign: 'center',
            borderRadius: '8px',
            background: onglet === 'messages' ? '#FF6B35' : 'transparent',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          💬 Messages ({messages.length})
        </div>
        <div
          onClick={() => setOnglet('utilisateurs')}
          style={{
            flex: 1,
            padding: '8px',
            textAlign: 'center',
            borderRadius: '8px',
            background: onglet === 'utilisateurs' ? '#FF6B35' : 'transparent',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          👥 Membres ({utilisateurs.length})
        </div>
      </div>
      {onglet === 'messages' && (
        <div style={{ padding: '14px 16px' }}>
          <div
            onClick={viderToutChat}
            style={{
              background: '#FF3B30',
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            🗑️ Vider tout le chat
          </div>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1.5px solid #FFE5D0',
                padding: '10px 12px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#aaa',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  {new Date(m.created_at).toLocaleString('fr-FR')} ·{' '}
                  {m.repas_id ? '💬 Chat repas' : '🌍 Chat global'}
                </div>
                <div style={{ fontSize: '13px', color: '#222', fontWeight: '600' }}>
                  {m.contenu}
                </div>
              </div>
              <div
                onClick={() => supprimerMessage(m.id)}
                style={{
                  background: '#FF3B30',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                🗑️
              </div>
            </div>
          ))}
        </div>
      )}
      {onglet === 'utilisateurs' && (
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>
            {utilisateurs.length} membres inscrits
          </div>
          {utilisateurs.map((u) => (
            <div
              key={u.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1.5px solid #FFE5D0',
                padding: '10px 12px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#FFE5D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                {u.photo_url ? (
                  <img
                    src={u.photo_url}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  '👤'
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>
                  {u.prenom || 'Anonyme'}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '600' }}>
                  📍 {u.ville || 'France'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
function App() {
  const [ecran, setEcran] = useState('accueil')
  const [user, setUser] = useState(null)
  const [repasSelectionne, setRepasSelectionne] = useState(null)
  const [repasChat, setRepasChat] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })
  }, [])

  if (!user) return <EcranConnexion setEcran={setEcran} setUser={setUser} />

  function ouvrirChatRepas(id) {
    setRepasChat(id)
    setEcran('chatrepas')
  }

  return (
    <div>
      {ecran === 'notifications' && <EcranNotifications setEcran={setEcran} />}
      {ecran === 'accueil' && <EcranAccueil setEcran={setEcran} user={user} />}
      {ecran === 'chercher' && (
        <EcranChercher setEcran={setEcran} user={user} onChatRepas={ouvrirChatRepas} />
      )}
      {ecran === 'mesrepas' && (
        <EcranMesRepas setEcran={setEcran} user={user} setRepasSelectionne={setRepasSelectionne} />
      )}
      {ecran === 'creerrepas' && <EcranCreerRepas setEcran={setEcran} />}
      {ecran === 'notation' && (
        <EcranNotation setEcran={setEcran} user={user} repasId={repasSelectionne} />
      )}
      {ecran === 'classement' && <EcranClassement setEcran={setEcran} />}
      {ecran === 'profil' && <EcranProfil setEcran={setEcran} setUser={setUser} user={user} />}
      {ecran === 'chat' && <EcranChat setEcran={setEcran} user={user} />}
      {ecran === 'chatrepas' && (
        <EcranChatRepas setEcran={setEcran} user={user} repasId={repasChat} />
      )}
      {ecran === 'cgu' && <EcranCGU setEcran={setEcran} />}
      {ecran === 'mentions' && <EcranMentions setEcran={setEcran} />}
      {ecran === 'confidentialite' && <EcranConfidentialite setEcran={setEcran} />}
      <Nav ecran={ecran} setEcran={setEcran} />
      {ecran === 'admin' && user.id === 'd89917e9-93b3-40a8-aca2-54627992354b' && (
        <EcranAdmin setEcran={setEcran} user={user} />
      )}
    </div>
  )
}

export default App
