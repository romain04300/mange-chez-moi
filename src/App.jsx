import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const ADMIN_ID = 'd89917e9-93b3-40a8-aca2-54627992354b'

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

function MenuMessage({ message, onFermer, onSupprimer, onModifier }) {
  const [modifier, setModifier] = useState(false)
  const [nouveau, setNouveau] = useState(message.contenu)
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 99,
        }}
        onClick={onFermer}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '20px 16px',
          zIndex: 100,
          boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '4px',
            background: '#eee',
            borderRadius: '2px',
            margin: '0 auto 16px',
          }}
        />
        <div
          style={{
            background: '#FFF8F0',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#333',
            fontWeight: '600',
            marginBottom: '16px',
            border: '1px solid #FFE5D0',
          }}
        >
          {message.contenu}
        </div>
        {modifier ? (
          <div>
            <input
              autoFocus
              value={nouveau}
              onChange={(e) => setNouveau(e.target.value)}
              style={{
                width: '100%',
                background: '#FFF8F0',
                border: '1.5px solid #FF6B35',
                borderRadius: '12px',
                padding: '12px 14px',
                fontFamily: 'Nunito,sans-serif',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '10px',
              }}
            />
            <div
              onClick={() => {
                if (nouveau.trim()) {
                  onModifier(message.id, nouveau)
                  onFermer()
                }
              }}
              style={{
                background: '#4CAF50',
                borderRadius: '12px',
                padding: '13px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              ✅ Valider la modification
            </div>
            <div
              onClick={() => setModifier(false)}
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
        ) : (
          <>
            <div
              onClick={() => setModifier(true)}
              style={{
                background: '#FF6B35',
                borderRadius: '12px',
                padding: '13px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              ✏️ Modifier
            </div>
            <div
              onClick={() => {
                onSupprimer(message.id)
                onFermer()
              }}
              style={{
                background: '#FF3B30',
                borderRadius: '12px',
                padding: '13px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              🗑️ Supprimer
            </div>
            <div
              onClick={onFermer}
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
          </>
        )}
      </div>
    </>
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
        padding: '8px 0 16px',
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
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
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: ecran === nom ? '#FFE5D0' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.2s',
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
    async function charger() {
      const { data: rd } = await supabase
        .from('repas')
        .select('*')
        .order('id', { ascending: false })
        .limit(5)
      if (rd) setRepas(rd)
      const { data: pd } = await supabase.from('profils').select('*').eq('id', user.id).single()
      if (pd) setProfil(pd)
      const { count: nr } = await supabase.from('repas').select('*', { count: 'exact', head: true })
      const { count: nm } = await supabase
        .from('profils')
        .select('*', { count: 'exact', head: true })
      const { count: nms } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
      setStats({ repas: nr || 0, membres: nm || 0, messages: nms || 0 })
    }
    charger()
  }, [])

  return (
    <div style={{ background: '#FFF8F0', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{ background: 'linear-gradient(135deg,#FF6B35,#FF8C42)', padding: '16px 16px 20px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontFamily: 'Pacifico,cursive',
              fontSize: '24px',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Mange Chez Moi
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              onClick={() => setEcran('notifications')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '7px 12px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
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
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '7px 12px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
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
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '14px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
            Bonjour {profil?.prenom || 'toi'} 👋
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
            Que manges-tu ce soir ?
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '10px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{stats.repas}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
              Repas
            </div>
          </div>
          <div
            onClick={() => setEcran('membres')}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
              {stats.membres}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
              Membres 👥
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '10px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>🇫🇷</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
              France
            </div>
          </div>
        </div>
      </div>

      {/* Repas à venir */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#222' }}>
            Repas à venir 🍽️
          </span>
          <span
            onClick={() => setEcran('chercher')}
            style={{ fontSize: '12px', fontWeight: '700', color: '#FF6B35', cursor: 'pointer' }}
          >
            Tout voir →
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {repas.map((r) => (
            <div
              key={r.id}
              onClick={() => setEcran('chercher')}
              style={{
                minWidth: '130px',
                background: '#fff',
                borderRadius: '16px',
                border: '1.5px solid #FFE5D0',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255,107,53,0.08)',
              }}
            >
              {r.photo_url ? (
                <img
                  src={r.photo_url}
                  style={{ width: '100%', height: '72px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    height: '72px',
                    background: r.couleur || '#FFECD0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                  }}
                >
                  {r.emoji}
                </div>
              )}
              <div style={{ padding: '8px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#222',
                    marginBottom: '2px',
                  }}
                >
                  {r.titre}
                </div>
                <div style={{ fontSize: '10px', color: '#888', fontWeight: '600' }}>{r.date}</div>
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '20px',
                    background: '#FFEDE5',
                    color: '#D04A10',
                    display: 'inline-block',
                    marginTop: '4px',
                  }}
                >
                  {r.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fil communauté */}
      <div style={{ padding: '0 16px 16px' }}>
        <div
          onClick={() => setEcran('creerrepas')}
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            borderRadius: '18px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            🍳
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
              Organise un repas chez toi
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
              3-8 invités · tu fixes le prix
            </div>
          </div>
          <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)' }}>›</div>
        </div>

        {repas.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#fff',
              borderRadius: '20px',
              border: '1.5px solid #FFE5D0',
              overflow: 'hidden',
              marginBottom: '14px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {r.photo_url ? (
              <img
                src={r.photo_url}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  height: '180px',
                  background: r.couleur || '#FFECD0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '72px',
                }}
              >
                {r.emoji}
              </div>
            )}
            <div style={{ padding: '12px 14px' }}>
              <div
                style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px', color: '#222' }}
              >
                {r.titre}
              </div>
              <div
                style={{ fontSize: '12px', color: '#888', fontWeight: '600', marginBottom: '10px' }}
              >
                {r.ville && <span>📍{r.ville} · </span>}
                {r.date} · {r.prix}€/pers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#D04A10',
                    padding: '5px 10px',
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
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
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
            textAlign: 'center',
            padding: '16px 0',
            borderTop: '1px solid #FFE5D0',
            marginTop: '8px',
          }}
        >
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '6px' }}
          >
            <span
              onClick={() => setEcran('cgu')}
              style={{
                fontSize: '11px',
                color: '#bbb',
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
                color: '#bbb',
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
                color: '#bbb',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Confidentialité
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#ddd', fontWeight: '600' }}>
            © 2026 Mange Chez Moi
          </div>
        </div>
      </div>
    </div>
  )
}

function EcranMembers({ setEcran, user, onMessagePrive }) {
  const [membres, setMembres] = useState([])

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.from('profils').select('*').order('prenom')
      if (data) setMembres(data)
    }
    charger()
  }, [])

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#fff', flex: 1 }}>
          Membres 👥
        </span>
        <div
          style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#fff',
          }}
        >
          {membres.length} inscrits
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {membres.map((m) => (
          <div
            key={m.id}
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #FFE5D0',
              padding: '12px 14px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#FFE5D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0,
                overflow: 'hidden',
                border: '2px solid #FFE5D0',
              }}
            >
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  style={{ width: '46px', height: '46px', objectFit: 'cover' }}
                />
              ) : (
                '👤'
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#222' }}>
                {m.prenom || 'Anonyme'}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', marginTop: '2px' }}>
                📍 {m.ville || 'France'}
              </div>
            </div>
            {m.id !== user.id && (
              <div
                onClick={() => {
                  onMessagePrive(m.id)
                }}
                style={{
                  background: 'linear-gradient(135deg,#6B35FF,#8B5CF6)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(107,53,255,0.3)',
                }}
              >
                ✉️ Message
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EcranChercher({ setEcran, user, onChatRepas, onVoirParticipants }) {
  const [repas, setRepas] = useState([])
  const [mesReservations, setMesReservations] = useState([])
  const [erreur, setErreur] = useState('')
  const [message, setMessage] = useState('')
  const [filtreVille, setFiltreVille] = useState('')

  useEffect(() => {
    async function charger() {
      const { data, error } = await supabase
        .from('repas')
        .select('*')
        .order('id', { ascending: false })
      if (error) {
        setErreur(error.message)
      } else {
        setRepas(data)
      }
      const { data: rd } = await supabase
        .from('reservations')
        .select('repas_id')
        .eq('user_id', user.id)
      if (rd) setMesReservations(rd.map((r) => r.repas_id))
    }
    charger()
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
      <div
        style={{ background: 'linear-gradient(135deg,#FF6B35,#FF8C42)', padding: '12px 16px 16px' }}
      >
        <div
          style={{
            fontFamily: 'Pacifico,cursive',
            fontSize: '20px',
            color: '#fff',
            marginBottom: '12px',
          }}
        >
          Trouver un repas
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <span style={{ fontSize: '16px' }}>🔍</span>
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
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#666', marginBottom: '12px' }}>
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
                borderRadius: '20px',
                border: '1.5px solid #FFE5D0',
                overflow: 'hidden',
                marginBottom: '14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {r.photo_url ? (
                <img
                  src={r.photo_url}
                  style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    height: '80px',
                    background: r.couleur || '#FFECD0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '44px',
                  }}
                >
                  {r.emoji}
                </div>
              )}
              <div style={{ padding: '12px 14px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#222',
                    marginBottom: '4px',
                  }}
                >
                  {r.titre}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#888',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}
                >
                  {r.ville && <span>📍{r.ville} · </span>}
                  {r.date} · {r.prix}€/pers
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div
                      onClick={() => onChatRepas(r.id)}
                      style={{
                        background: '#EDE0FF',
                        color: '#6B35FF',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '7px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      💬
                    </div>
                    <div
                      onClick={() => onVoirParticipants(r.id)}
                      style={{
                        background: '#E0F5E8',
                        color: '#085041',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '7px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      👥
                    </div>
                  </div>
                  <div
                    onClick={() => !mesReservations.includes(r.id) && reserver(r.id)}
                    style={{
                      background: mesReservations.includes(r.id) ? '#E0F5E8' : '#FF6B35',
                      color: mesReservations.includes(r.id) ? '#085041' : '#fff',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: mesReservations.includes(r.id) ? 'default' : 'pointer',
                      boxShadow: mesReservations.includes(r.id)
                        ? 'none'
                        : '0 2px 8px rgba(255,107,53,0.3)',
                    }}
                  >
                    {mesReservations.includes(r.id) ? 'Réservé ✓' : 'Réserver'}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

function EcranParticipants({ setEcran, repasId }) {
  const [repas, setRepas] = useState(null)
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    if (!repasId) return
    async function charger() {
      const { data: r } = await supabase.from('repas').select('*').eq('id', repasId).single()
      setRepas(r)
      const { data: res } = await supabase
        .from('reservations')
        .select('*, profils(prenom,photo_url,ville)')
        .eq('repas_id', repasId)
      if (res) setParticipants(res)
    }
    charger()
  }, [repasId])

  if (!repasId) return null

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('chercher')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Pacifico,cursive', fontSize: '16px', color: '#fff' }}>
            Participants 👥
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
            {repas?.titre}
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#fff',
          }}
        >
          {participants.length} inscrits
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {repas && (
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #FFE5D0',
              padding: '14px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{ fontSize: '15px', fontWeight: '800', color: '#222', marginBottom: '4px' }}
            >
              {repas.emoji} {repas.titre}
            </div>
            <div style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>
              {repas.ville && <span>📍{repas.ville} · </span>}
              {repas.date} · {repas.prix}€/pers · {repas.places} places
            </div>
          </div>
        )}
        {participants.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '40px' }}>
            Aucun participant pour l'instant
          </div>
        ) : (
          participants.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1.5px solid #FFE5D0',
                padding: '12px 14px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#FFE5D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {p.profils?.photo_url ? (
                  <img
                    src={p.profils.photo_url}
                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                  />
                ) : (
                  '👤'
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>
                  {p.profils?.prenom || 'Anonyme'}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '600' }}>
                  📍 {p.profils?.ville || 'France'}
                </div>
              </div>
              <div
                style={{
                  background: '#E0F5E8',
                  color: '#085041',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '20px',
                }}
              >
                ✓ Inscrit
              </div>
            </div>
          ))
        )}
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
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#fff' }}>
          Nouveau repas 🍳
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: emoji === e ? '#FFE5D0' : '#f8f8f8',
                  border: emoji === e ? '2px solid #FF6B35' : '1.5px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
        {[
          {
            label: 'Titre du repas',
            value: titre,
            setter: setTitre,
            placeholder: 'Ex: Tajine maison aux pruneaux',
          },
          {
            label: 'Ville',
            value: ville,
            setter: setVille,
            placeholder: 'Ex: Paris, Lyon, Bordeaux...',
          },
          {
            label: 'Date & heure',
            value: date,
            setter: setDate,
            placeholder: 'Ex: Sam. 5 avr. · 19h',
          },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#888',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {label}
            </div>
            <input
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%',
                background: '#FFF8F0',
                border: '1.5px solid #FFE5D0',
                borderRadius: '14px',
                padding: '12px 14px',
                fontFamily: 'Nunito,sans-serif',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          {[
            { label: 'Nb invités', value: places, setter: setPlaces },
            { label: 'Prix (€)', value: prix, setter: setPrix },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#888',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {label}
              </div>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                min="0"
                style={{
                  width: '100%',
                  background: '#FFF8F0',
                  border: '1.5px solid #FFE5D0',
                  borderRadius: '14px',
                  padding: '12px 13px',
                  fontFamily: 'Nunito,sans-serif',
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#FF6B35',
                  outline: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
                borderRadius: '14px',
                marginTop: '10px',
                height: '160px',
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
              borderRadius: '12px',
              marginBottom: '14px',
            }}
          >
            {message}
          </div>
        )}
        <div
          onClick={creerRepas}
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            borderRadius: '16px',
            padding: '15px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '800',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
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
    async function charger() {
      const { data } = await supabase
        .from('reservations')
        .select('*, repas(*)')
        .eq('user_id', user.id)
      if (data) setReservations(data)
    }
    charger()
  }, [])

  return (
    <div>
      <div
        style={{ background: 'linear-gradient(135deg,#FF6B35,#FF8C42)', padding: '12px 16px 16px' }}
      >
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '20px', color: '#fff' }}>
          Mes repas 🍽️
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div
          onClick={() => setEcran('creerrepas')}
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            borderRadius: '18px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            🍳
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
              Organiser un nouveau repas
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
              3-8 invités · tu fixes le prix
            </div>
          </div>
          <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)' }}>›</div>
        </div>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#666', marginBottom: '12px' }}>
          Mes réservations ({reservations.length})
        </div>
        {reservations.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #FFE5D0',
              marginBottom: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: r.repas?.couleur || '#FFE5D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {r.repas?.photo_url ? (
                <img
                  src={r.repas.photo_url}
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
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
                {r.repas?.date} · {r.repas?.prix}€/pers
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
                fontSize: '11px',
                fontWeight: '700',
                padding: '7px 12px',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
            >
              ⭐ Noter
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
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('mesrepas')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#fff' }}>
          Noter ce repas ⭐
        </span>
      </div>
      <div style={{ padding: '24px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#222', marginBottom: '18px' }}>
            Quelle note donnes-tu à ce repas ?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                onClick={() => setNote(n)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: note >= n ? '#FFD600' : '#f5f5f5',
                  border: note >= n ? '2px solid #EF9F27' : '1.5px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: note >= n ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                ★
              </div>
            ))}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#FF6B35', marginTop: '12px' }}>
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
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
              borderRadius: '14px',
              padding: '12px 14px',
              fontFamily: 'Nunito,sans-serif',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              minHeight: '100px',
              boxSizing: 'border-box',
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
              borderRadius: '12px',
              marginBottom: '14px',
            }}
          >
            {message}
          </div>
        )}
        <div
          onClick={noter}
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            borderRadius: '16px',
            padding: '15px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '800',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
          }}
        >
          Envoyer ma note ⭐
        </div>
      </div>
    </div>
  )
}

function EcranClassement({ setEcran, onMessagePrive }) {
  const [joueurs, setJoueurs] = useState([])
  const [membreSelectionne, setMembreSelectionne] = useState(null)

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.from('classement_view').select('*')
      if (data) setJoueurs(data)
    }
    charger()
  }, [])

  if (membreSelectionne)
    return (
      <div>
        <div
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            padding: '12px 16px 28px',
          }}
        >
          <div
            onClick={() => setMembreSelectionne(null)}
            style={{ color: '#fff', fontSize: '20px', cursor: 'pointer', marginBottom: '12px' }}
          >
            ←
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
              }}
            >
              👤
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
              {membreSelectionne.prenom || 'Anonyme'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
              📍 {membreSelectionne.ville || 'France'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', background: '#fff', borderBottom: '1.5px solid #FFE5D0' }}>
          <div style={{ flex: 1, padding: '14px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#FF6B35' }}>
              {Math.round(membreSelectionne.total_pts)}
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', marginTop: '2px' }}>
              Points
            </div>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <div
            onClick={() => {
              onMessagePrive(membreSelectionne.id)
              setMembreSelectionne(null)
            }}
            style={{
              background: 'linear-gradient(135deg,#6B35FF,#8B5CF6)',
              borderRadius: '16px',
              padding: '15px',
              textAlign: 'center',
              fontSize: '15px',
              fontWeight: '800',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(107,53,255,0.3)',
            }}
          >
            ✉️ Envoyer un message privé
          </div>
        </div>
      </div>
    )

  return (
    <div>
      <div
        style={{ background: 'linear-gradient(135deg,#FF6B35,#FF8C42)', padding: '12px 16px 16px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '20px', color: '#fff' }}>
            Classement 🏆
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
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
            background: 'rgba(0,0,0,0.12)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>
            ⏳ Fin de manche dans
          </span>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFD600' }}>12 jours</span>
        </div>
      </div>
      <div style={{ padding: '8px 16px' }}>
        {joueurs.map((j, i) => (
          <div
            key={j.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #FFE5D0',
              marginBottom: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{ width: '30px', textAlign: 'center', fontSize: '18px', fontWeight: '800' }}
            >
              {i === 0 ? (
                '🥇'
              ) : i === 1 ? (
                '🥈'
              ) : i === 2 ? (
                '🥉'
              ) : (
                <span style={{ fontSize: '13px', color: '#aaa' }}>{i + 1}</span>
              )}
            </div>
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
              }}
            >
              👤
            </div>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setMembreSelectionne(j)}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#FF6B35' }}>
                {j.prenom || 'Anonyme'}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa', fontWeight: '600' }}>
                📍 {j.ville || 'France'}
              </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#FF6B35' }}>
              {Math.round(j.total_pts)} pts
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          margin: '0 16px 16px',
          background: '#222',
          borderRadius: '18px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span style={{ fontSize: '32px' }}>🏆</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFD600' }}>
            Grande Finale — Mois 5
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '600',
              marginTop: '2px',
            }}
          >
            Top 3 cette manche → qualifiés
          </div>
        </div>
        <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)' }}>›</span>
      </div>
    </div>
  )
}

function EcranProfil({ setEcran, setUser, user }) {
  const [profil, setProfil] = useState(null)
  const [notations, setNotations] = useState([])
  const [moyenne, setMoyenne] = useState(0)

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.from('profils').select('*').eq('id', user.id).single()
      setProfil(data)
      const { data: notes } = await supabase.from('notations').select('*').eq('noteur_id', user.id)
      if (notes && notes.length > 0) {
        setNotations(notes)
        setMoyenne((notes.reduce((a, n) => a + n.note, 0) / notes.length).toFixed(1))
      }
    }
    charger()
  }, [])

  return (
    <div>
      <div
        style={{ background: 'linear-gradient(135deg,#FF6B35,#FF8C42)', padding: '12px 16px 28px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
          }}
        >
          <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#fff' }}>
            Mon profil
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {user.id === ADMIN_ID && (
              <div
                onClick={() => setEcran('admin')}
                style={{
                  background: 'rgba(255,214,0,0.3)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#fff',
                  cursor: 'pointer',
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
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Déco
            </div>
            <div
              onClick={async () => {
                const c = window.prompt('Pour supprimer ton compte, tape SUPPRIMER')
                if (c === 'SUPPRIMER') {
                  await supabase.rpc('delete_user')
                  await supabase.auth.signOut()
                  setUser(null)
                } else if (c !== null) window.alert('Texte incorrect.')
              }}
              style={{
                background: 'rgba(255,0,0,0.2)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              🗑️
            </div>
          </div>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ position: 'relative' }}>
            {profil?.photo_url ? (
              <img
                src={profil.photo_url}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                }}
              >
                👨
              </div>
            )}
            <label
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#FF6B35',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                cursor: 'pointer',
                border: '2px solid #fff',
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
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
            {profil?.prenom || user?.email}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
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
        ].map(([v, l]) => (
          <div
            key={l}
            style={{
              flex: 1,
              padding: '14px 8px',
              textAlign: 'center',
              borderRight: '1px solid #FFE5D0',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#FF6B35' }}>{v}</div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', marginTop: '2px' }}>
              {l}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>
          Mes derniers avis
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
              borderRadius: '16px',
              padding: '14px',
              marginBottom: '10px',
              border: '1px solid #FFE5D0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ color: '#FFD600', fontSize: '16px' }}>
                {'★'.repeat(n.note)}
                {'☆'.repeat(5 - n.note)}
              </div>
              <div
                style={{ marginLeft: 'auto', fontSize: '10px', color: '#aaa', fontWeight: '600' }}
              >
                {new Date(n.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#555', fontWeight: '600', lineHeight: '1.6' }}>
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
  const [mdp, setMdp] = useState('')
  const [prenom, setPrenom] = useState('')
  const [erreur, setErreur] = useState('')
  const [mode, setMode] = useState('connexion')
  const [voirMdp, setVoirMdp] = useState(false)

  async function submit() {
    setErreur('')
    if (mode === 'inscription') {
      const { data, error } = await supabase.auth.signUp({ email, password: mdp })
      if (error) {
        setErreur(error.message)
      } else {
        await supabase.from('profils').insert({ id: data.user.id, prenom, ville: 'France' })
        setErreur('Compte créé ! Tu peux te connecter.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: mdp })
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
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '50px 24px 36px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Pacifico,cursive',
            fontSize: '32px',
            color: '#fff',
            marginBottom: '8px',
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          Mange Chez Moi
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
          Repas chez l'habitant en France 🇫🇷
        </div>
      </div>
      <div style={{ padding: '24px 20px', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            background: '#FFE5D0',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '24px',
          }}
        >
          {['connexion', 'inscription'].map((m) => (
            <div
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '10px',
                textAlign: 'center',
                borderRadius: '12px',
                background: mode === m ? '#FF6B35' : 'transparent',
                color: mode === m ? '#fff' : '#888',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {m === 'connexion' ? 'Connexion' : 'Inscription'}
            </div>
          ))}
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
                letterSpacing: '0.5px',
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
                background: '#fff',
                border: '1.5px solid #FFE5D0',
                borderRadius: '14px',
                padding: '13px 14px',
                fontFamily: 'Nunito,sans-serif',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
              letterSpacing: '0.5px',
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
              background: '#fff',
              border: '1.5px solid #FFE5D0',
              borderRadius: '14px',
              padding: '13px 14px',
              fontFamily: 'Nunito,sans-serif',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#888',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Mot de passe
          </div>
          <div style={{ position: 'relative' }}>
            <input
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              type={voirMdp ? 'text' : 'password'}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: '#fff',
                border: '1.5px solid #FFE5D0',
                borderRadius: '14px',
                padding: '13px 44px 13px 14px',
                fontFamily: 'Nunito,sans-serif',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            />
            <div
              onClick={() => setVoirMdp(!voirMdp)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '18px',
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
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          >
            {erreur}
          </div>
        )}
        <div
          onClick={submit}
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '800',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,107,53,0.35)',
          }}
        >
          {mode === 'connexion' ? 'Se connecter 🚀' : "S'inscrire 🎉"}
        </div>
      </div>
    </div>
  )
}

function ChatView({
  messages,
  user,
  profil,
  messagesRef,
  onMessageClick,
  texte,
  setTexte,
  envoyer,
}) {
  return (
    <>
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: '14px',
              display: 'flex',
              flexDirection: m.user_id === user.id ? 'row-reverse' : 'row',
              gap: '8px',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
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
                  marginBottom: '3px',
                  textAlign: m.user_id === user.id ? 'right' : 'left',
                }}
              >
                {m.user_id === user.id ? profil?.prenom || 'Moi' : 'Membre'}
              </div>
              <div
                onClick={() => {
                  if (m.user_id === user.id) onMessageClick(m)
                }}
                style={{
                  background:
                    m.user_id === user.id ? 'linear-gradient(135deg,#FF6B35,#FF8C42)' : '#fff',
                  color: m.user_id === user.id ? '#fff' : '#222',
                  borderRadius: m.user_id === user.id ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1.5px solid',
                  borderColor: m.user_id === user.id ? 'transparent' : '#FFE5D0',
                  maxWidth: '240px',
                  cursor: m.user_id === user.id ? 'pointer' : 'default',
                  boxShadow:
                    m.user_id === user.id
                      ? '0 2px 8px rgba(255,107,53,0.25)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
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
            borderRadius: '24px',
            padding: '11px 16px',
            fontFamily: 'Nunito,sans-serif',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <div
          onClick={envoyer}
          style={{
            background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
            flexShrink: 0,
          }}
        >
          ➤
        </div>
      </div>
    </>
  )
}

function EcranChat({ setEcran, user }) {
  const [messages, setMessages] = useState([])
  const [texte, setTexte] = useState('')
  const [profil, setProfil] = useState(null)
  const [msgSel, setMsgSel] = useState(null)
  const ref = useRef(null)

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
    const c = supabase
      .channel('chat-global-' + Math.random())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => {
        if (!p.new.repas_id) setMessages((prev) => [...prev, p.new])
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (p) => {
        setMessages((prev) => prev.filter((m) => m.id !== p.old.id))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (p) => {
        setMessages((prev) => prev.map((m) => (m.id === p.new.id ? p.new : m)))
      })
      .subscribe()
    return () => {
      supabase.removeChannel(c)
    }
  }, [])

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  async function envoyer() {
    if (!texte.trim()) return
    await supabase.from('messages').insert({ user_id: user.id, contenu: texte, repas_id: null })
    setTexte('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {msgSel && (
        <MenuMessage
          message={msgSel}
          onFermer={() => setMsgSel(null)}
          onSupprimer={async (id) => {
            await supabase.from('messages').delete().eq('id', id)
            setMessages((p) => p.filter((m) => m.id !== id))
          }}
          onModifier={async (id, v) => {
            await supabase.from('messages').update({ contenu: v }).eq('id', id)
            setMessages((p) => p.map((m) => (m.id === id ? { ...m, contenu: v } : m)))
          }}
        />
      )}
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#fff', flex: 1 }}>
          Chat communauté 💬
        </span>
      </div>
      <ChatView
        messages={messages}
        user={user}
        profil={profil}
        messagesRef={ref}
        onMessageClick={setMsgSel}
        texte={texte}
        setTexte={setTexte}
        envoyer={envoyer}
      />
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
      if (data) {
        const s = JSON.parse(localStorage.getItem('notifs_supprimees') || '[]')
        setRepas(data.filter((r) => !s.includes(r.id)))
      }
    }
    charger()
  }, [])

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#fff' }}>
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
              padding: '12px 14px',
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #FFE5D0',
              marginBottom: '10px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            onClick={() => setEcran('chercher')}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: r.couleur || '#FFECD0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {r.photo_url ? (
                <img
                  src={r.photo_url}
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
              ) : (
                r.emoji
              )}
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
            <div
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Supprimer cette notification ?')) {
                  const s = JSON.parse(localStorage.getItem('notifs_supprimees') || '[]')
                  localStorage.setItem('notifs_supprimees', JSON.stringify([...s, r.id]))
                  setRepas((p) => p.filter((rep) => rep.id !== r.id))
                }
              }}
              style={{ fontSize: '18px', cursor: 'pointer', opacity: '0.4', padding: '4px' }}
            >
              ✕
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
  const [msgSel, setMsgSel] = useState(null)
  const ref = useRef(null)

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
    const c = supabase
      .channel('chat-repas-' + repasId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `repas_id=eq.${repasId}` },
        (p) => {
          setMessages((prev) => [...prev, p.new])
        },
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (p) => {
        setMessages((prev) => prev.filter((m) => m.id !== p.old.id))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (p) => {
        setMessages((prev) => prev.map((m) => (m.id === p.new.id ? p.new : m)))
      })
      .subscribe()
    return () => {
      supabase.removeChannel(c)
    }
  }, [repasId])

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  if (!repasId) return null

  async function envoyer() {
    if (!texte.trim()) return
    await supabase.from('messages').insert({ user_id: user.id, contenu: texte, repas_id: repasId })
    setTexte('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {msgSel && (
        <MenuMessage
          message={msgSel}
          onFermer={() => setMsgSel(null)}
          onSupprimer={async (id) => {
            await supabase.from('messages').delete().eq('id', id)
            setMessages((p) => p.filter((m) => m.id !== id))
          }}
          onModifier={async (id, v) => {
            await supabase.from('messages').update({ contenu: v }).eq('id', id)
            setMessages((p) => p.map((m) => (m.id === id ? { ...m, contenu: v } : m)))
          }}
        />
      )}
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('chercher')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '16px', color: '#fff' }}>
            Chat 💬
          </span>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
            {repas?.titre}
          </div>
        </div>
      </div>
      <ChatView
        messages={messages}
        user={user}
        profil={profil}
        messagesRef={ref}
        onMessageClick={setMsgSel}
        texte={texte}
        setTexte={setTexte}
        envoyer={envoyer}
      />
    </div>
  )
}

function EcranAdmin({ setEcran }) {
  const [messages, setMessages] = useState([])
  const [utilisateurs, setUtilisateurs] = useState([])
  const [repas, setRepas] = useState([])
  const [msgPrives, setMsgPrives] = useState([])
  const [onglet, setOnglet] = useState('messages')
  const [repasChat, setRepasChat] = useState(null)
  const [messagesRepas, setMessagesRepas] = useState([])

  useEffect(() => {
    async function charger() {
      const { data: m } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (m) setMessages(m)
      const { data: u } = await supabase.from('profils').select('*')
      if (u) setUtilisateurs(u)
      const { data: r } = await supabase.from('repas').select('*').order('id', { ascending: false })
      if (r) setRepas(r)
      const { data: mp } = await supabase
        .from('messages_prives')
        .select(
          '*, expediteur:profils!messages_prives_expediteur_id_fkey(prenom), destinataire:profils!messages_prives_destinataire_id_fkey(prenom)',
        )
        .order('created_at', { ascending: false })
        .limit(100)
      if (mp) setMsgPrives(mp)
    }
    charger()
    const c = supabase
      .channel('admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => charger())
      .subscribe()
    return () => {
      supabase.removeChannel(c)
    }
  }, [])

  async function supprimerMsg(id, table = 'messages') {
    await supabase.from(table).delete().eq('id', id)
    if (table === 'messages') {
      setMessages((p) => p.filter((m) => m.id !== id))
      setMessagesRepas((p) => p.filter((m) => m.id !== id))
    } else setMsgPrives((p) => p.filter((m) => m.id !== id))
  }

  const msgGlobal = messages.filter((m) => !m.repas_id)

  return (
    <div>
      <div
        style={{
          background: '#1a1a2e',
          padding: '12px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#FFD600', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span
          style={{ fontFamily: 'Pacifico,cursive', fontSize: '18px', color: '#FFD600', flex: 1 }}
        >
          Panel Admin 🔧
        </span>
      </div>
      <div style={{ display: 'flex', background: '#16213e', padding: '4px', overflowX: 'auto' }}>
        {[
          ['messages', '💬 Chat'],
          ['chatsrepas', '🍽️ Repas'],
          ['prives', '✉️ Privés'],
          ['utilisateurs', '👥 Membres'],
          ['repas', '📋 Repas'],
        ].map(([id, label]) => (
          <div
            key={id}
            onClick={() => {
              setOnglet(id)
              setRepasChat(null)
            }}
            style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              borderRadius: '8px',
              background: onglet === id ? '#FF6B35' : 'transparent',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minWidth: '70px',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {onglet === 'messages' && (
        <div style={{ padding: '14px 16px' }}>
          <div
            onClick={async () => {
              if (window.confirm('Vider le chat global ?')) {
                await supabase.from('messages').delete().is('repas_id', null)
                setMessages((p) => p.filter((m) => m.repas_id))
              }
            }}
            style={{
              background: '#FF3B30',
              borderRadius: '12px',
              padding: '11px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            🗑️ Vider tout le chat global
          </div>
          {msgGlobal.map((m) => (
            <div
              key={m.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1.5px solid #FFE5D0',
                padding: '10px 12px',
                marginBottom: '8px',
                display: 'flex',
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
                  {new Date(m.created_at).toLocaleString('fr-FR')}
                </div>
                <div style={{ fontSize: '13px', color: '#222', fontWeight: '600' }}>
                  {m.contenu}
                </div>
              </div>
              <div
                onClick={() => supprimerMsg(m.id)}
                style={{
                  background: '#FF3B30',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}
              >
                🗑️
              </div>
            </div>
          ))}
        </div>
      )}

      {onglet === 'chatsrepas' && (
        <div style={{ padding: '14px 16px' }}>
          {repasChat ? (
            <>
              <div
                onClick={() => setRepasChat(null)}
                style={{
                  color: '#FF6B35',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: '12px',
                }}
              >
                ← Retour aux repas
              </div>
              {messagesRepas.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    border: '1.5px solid #FFE5D0',
                    padding: '10px 12px',
                    marginBottom: '8px',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>
                      {new Date(m.created_at).toLocaleString('fr-FR')}
                    </div>
                    <div style={{ fontSize: '13px', color: '#222', fontWeight: '600' }}>
                      {m.contenu}
                    </div>
                  </div>
                  <div
                    onClick={() => supprimerMsg(m.id)}
                    style={{
                      background: '#FF3B30',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      color: '#fff',
                      fontWeight: '700',
                      cursor: 'pointer',
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}
                  >
                    🗑️
                  </div>
                </div>
              ))}
            </>
          ) : (
            repas.map((r) => {
              const nb = messages.filter((m) => m.repas_id === r.id).length
              return (
                <div
                  key={r.id}
                  onClick={async () => {
                    const { data } = await supabase
                      .from('messages')
                      .select('*')
                      .eq('repas_id', r.id)
                      .order('created_at', { ascending: true })
                    if (data) setMessagesRepas(data)
                    setRepasChat(r.id)
                  }}
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    border: '1.5px solid #FFE5D0',
                    padding: '12px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{r.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>
                      {r.titre}
                    </div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{nb} messages</div>
                  </div>
                  <span style={{ fontSize: '16px', color: '#ccc' }}>›</span>
                </div>
              )
            })
          )}
        </div>
      )}

      {onglet === 'prives' && (
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>
            {msgPrives.length} messages privés
          </div>
          {msgPrives.map((m) => (
            <div
              key={m.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1.5px solid #EDE0FF',
                padding: '10px 12px',
                marginBottom: '8px',
                display: 'flex',
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
                  {m.expediteur?.prenom || '?'} → {m.destinataire?.prenom || '?'} ·{' '}
                  {new Date(m.created_at).toLocaleString('fr-FR')}
                </div>
                <div style={{ fontSize: '13px', color: '#222', fontWeight: '600' }}>
                  {m.contenu}
                </div>
              </div>
              <div
                onClick={() => supprimerMsg(m.id, 'messages_prives')}
                style={{
                  background: '#FF3B30',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0,
                  alignSelf: 'center',
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
            {utilisateurs.length} membres
          </div>
          {utilisateurs.map((u) => (
            <div
              key={u.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
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
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#FFE5D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  overflow: 'hidden',
                }}
              >
                {u.photo_url ? (
                  <img
                    src={u.photo_url}
                    style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                  />
                ) : (
                  '👤'
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>
                  {u.prenom || 'Anonyme'}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>📍 {u.ville || 'France'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {onglet === 'repas' && (
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>
            {repas.length} repas
          </div>
          {repas.map((r) => (
            <div
              key={r.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1.5px solid #FFE5D0',
                padding: '10px 12px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div style={{ fontSize: '24px' }}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#222' }}>{r.titre}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>
                  📍 {r.ville || 'France'} · {r.date}
                </div>
              </div>
              <div
                onClick={async () => {
                  if (window.confirm('Supprimer ce repas ?')) {
                    await supabase.from('repas').delete().eq('id', r.id)
                    setRepas((p) => p.filter((rep) => rep.id !== r.id))
                  }
                }}
                style={{
                  background: '#FF3B30',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                🗑️
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EcranMessagesPrive({ setEcran, user, membreId }) {
  const [messages, setMessages] = useState([])
  const [texte, setTexte] = useState('')
  const [profil, setProfil] = useState(null)
  const [membreProfil, setMembreProfil] = useState(null)
  const [msgSel, setMsgSel] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!membreId) return
    async function charger() {
      const { data: p } = await supabase.from('profils').select('*').eq('id', user.id).single()
      setProfil(p)
      const { data: mp } = await supabase.from('profils').select('*').eq('id', membreId).single()
      setMembreProfil(mp)
      const { data: m } = await supabase
        .from('messages_prives')
        .select('*')
        .or(
          `and(expediteur_id.eq.${user.id},destinataire_id.eq.${membreId}),and(expediteur_id.eq.${membreId},destinataire_id.eq.${user.id})`,
        )
        .order('created_at', { ascending: true })
      if (m) setMessages(m)
    }
    charger()
    const c = supabase
      .channel('mp-' + user.id + '-' + membreId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages_prives' },
        (p) => {
          if (
            (p.new.expediteur_id === user.id && p.new.destinataire_id === membreId) ||
            (p.new.expediteur_id === membreId && p.new.destinataire_id === user.id)
          )
            setMessages((prev) => [...prev, p.new])
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(c)
    }
  }, [membreId])

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  if (!membreId) return null

  async function envoyer() {
    if (!texte.trim()) return
    await supabase
      .from('messages_prives')
      .insert({ expediteur_id: user.id, destinataire_id: membreId, contenu: texte })
    setTexte('')
  }

  const msgsFormatted = messages.map((m) => ({ ...m, user_id: m.expediteur_id }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {msgSel && (
        <MenuMessage
          message={msgSel}
          onFermer={() => setMsgSel(null)}
          onSupprimer={async (id) => {
            await supabase.from('messages_prives').delete().eq('id', id)
            setMessages((p) => p.filter((m) => m.id !== id))
          }}
          onModifier={async (id, v) => {
            await supabase.from('messages_prives').update({ contenu: v }).eq('id', id)
            setMessages((p) => p.map((m) => (m.id === id ? { ...m, contenu: v } : m)))
          }}
        />
      )}
      <div
        style={{
          background: 'linear-gradient(135deg,#6B35FF,#8B5CF6)',
          padding: '12px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {membreProfil?.photo_url ? (
            <img
              src={membreProfil.photo_url}
              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
            />
          ) : (
            '👤'
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Pacifico,cursive', fontSize: '15px', color: '#fff' }}>
            Message privé ✉️
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
            {membreProfil?.prenom || 'Membre'}
          </div>
        </div>
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '40px' }}>
            Aucun message — dis bonjour ! 👋
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: '14px',
              display: 'flex',
              flexDirection: m.expediteur_id === user.id ? 'row-reverse' : 'row',
              gap: '8px',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#EDE0FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {(m.expediteur_id === user.id ? profil : membreProfil)?.photo_url ? (
                <img
                  src={(m.expediteur_id === user.id ? profil : membreProfil).photo_url}
                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#aaa',
                  fontWeight: '600',
                  marginBottom: '3px',
                  textAlign: m.expediteur_id === user.id ? 'right' : 'left',
                }}
              >
                {m.expediteur_id === user.id
                  ? profil?.prenom || 'Moi'
                  : membreProfil?.prenom || 'Membre'}
              </div>
              <div
                onClick={() => {
                  if (m.expediteur_id === user.id) setMsgSel(m)
                }}
                style={{
                  background:
                    m.expediteur_id === user.id
                      ? 'linear-gradient(135deg,#6B35FF,#8B5CF6)'
                      : '#fff',
                  color: m.expediteur_id === user.id ? '#fff' : '#222',
                  borderRadius:
                    m.expediteur_id === user.id ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1.5px solid',
                  borderColor: m.expediteur_id === user.id ? 'transparent' : '#EDE0FF',
                  maxWidth: '240px',
                  cursor: m.expediteur_id === user.id ? 'pointer' : 'default',
                  boxShadow:
                    m.expediteur_id === user.id
                      ? '0 2px 8px rgba(107,53,255,0.25)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
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
          borderTop: '1.5px solid #EDE0FF',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && envoyer()}
          placeholder="Message privé..."
          style={{
            flex: 1,
            background: '#F5F0FF',
            border: '1.5px solid #EDE0FF',
            borderRadius: '24px',
            padding: '11px 16px',
            fontFamily: 'Nunito,sans-serif',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <div
          onClick={envoyer}
          style={{
            background: 'linear-gradient(135deg,#6B35FF,#8B5CF6)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(107,53,255,0.3)',
            flexShrink: 0,
          }}
        >
          ➤
        </div>
      </div>
    </div>
  )
}

function EcranLegal({ setEcran, page }) {
  const content = {
    cgu: {
      titre: 'CGU',
      h2: "Conditions Générales d'Utilisation",
      sections: [
        [
          '1. Objet',
          "Mange Chez Moi est une plateforme de mise en relation entre hôtes proposant des repas faits maison et des convives. L'utilisation de l'application implique l'acceptation des présentes CGU.",
        ],
        [
          '2. Inscription',
          "L'accès à l'application nécessite la création d'un compte avec une adresse email valide. L'utilisateur est responsable de la confidentialité de ses identifiants.",
        ],
        [
          '3. Responsabilités',
          "Mange Chez Moi est une plateforme de mise en relation. Elle n'est pas responsable de la qualité des repas ni des transactions effectuées en dehors de la plateforme.",
        ],
        [
          '4. Comportement',
          "Les utilisateurs s'engagent à respecter les autres membres et à utiliser l'application de bonne foi.",
        ],
        [
          '5. Résiliation',
          "L'utilisateur peut supprimer son compte à tout moment en contactant scorpio13860@hotmail.fr.",
        ],
        ['6. Droit applicable', 'Les présentes CGU sont soumises au droit français.'],
      ],
    },
    mentions: {
      titre: 'Mentions légales',
      h2: 'Mentions Légales',
      sections: [
        [
          'Éditeur',
          'Romera Romain\n914 boulevard de la Coopérative\n13610 Le Puy Sainte Réparade\nEmail : scorpio13860@hotmail.fr',
        ],
        ['Hébergement', 'Vercel Inc. — vercel.com'],
        ['Base de données', 'Supabase Inc. — supabase.com'],
        [
          'Propriété intellectuelle',
          'Tout le contenu de Mange Chez Moi est protégé. Toute reproduction est interdite sans autorisation.',
        ],
      ],
    },
    confidentialite: {
      titre: 'Confidentialité',
      h2: 'Politique de Confidentialité',
      sections: [
        [
          'Données collectées',
          'Email, prénom, ville, photo de profil, repas créés, réservations, messages envoyés.',
        ],
        [
          'Utilisation',
          "Données utilisées uniquement pour le fonctionnement de l'application. Non revendues.",
        ],
        ['Cookies', 'Cookies de session uniquement. Aucun cookie publicitaire.'],
        [
          'Vos droits (RGPD)',
          "Droit d'accès, rectification, suppression. Contact : scorpio13860@hotmail.fr",
        ],
        [
          'Conservation',
          'Données conservées tant que votre compte est actif. Supprimées en 30 jours après résiliation.',
        ],
      ],
    },
  }
  const c = content[page]
  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
          padding: '12px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => setEcran('accueil')}
          style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </div>
        <span style={{ fontFamily: 'Pacifico,cursive', fontSize: '16px', color: '#fff' }}>
          {c.titre}
        </span>
      </div>
      <div style={{ padding: '20px 16px', fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px', color: '#222' }}>
          {c.h2}
        </h2>
        {c.sections.map(([titre, texte]) => (
          <div key={titre} style={{ marginBottom: '16px' }}>
            <h3
              style={{ fontSize: '14px', fontWeight: '800', color: '#FF6B35', marginBottom: '6px' }}
            >
              {titre}
            </h3>
            <p style={{ color: '#444', lineHeight: '1.8' }}>{texte}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [ecran, setEcran] = useState('accueil')
  const [user, setUser] = useState(null)
  const [repasSelectionne, setRepasSelectionne] = useState(null)
  const [repasChat, setRepasChat] = useState(null)
  const [repasParticipants, setRepasParticipants] = useState(null)
  const [membreMessage, setMembreMessage] = useState(null)

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
  function ouvrirMessagePrive(id) {
    setMembreMessage(id)
    setEcran('messagesprive')
  }
  function ouvrirParticipants(id) {
    setRepasParticipants(id)
    setEcran('participants')
  }

  return (
    <div>
      {ecran === 'accueil' && <EcranAccueil setEcran={setEcran} user={user} />}
      {ecran === 'membres' && (
        <EcranMembers setEcran={setEcran} user={user} onMessagePrive={ouvrirMessagePrive} />
      )}
      {ecran === 'notifications' && <EcranNotifications setEcran={setEcran} />}
      {ecran === 'chercher' && (
        <EcranChercher
          setEcran={setEcran}
          user={user}
          onChatRepas={ouvrirChatRepas}
          onVoirParticipants={ouvrirParticipants}
        />
      )}
      {ecran === 'participants' && (
        <EcranParticipants setEcran={setEcran} repasId={repasParticipants} />
      )}
      {ecran === 'mesrepas' && (
        <EcranMesRepas setEcran={setEcran} user={user} setRepasSelectionne={setRepasSelectionne} />
      )}
      {ecran === 'creerrepas' && <EcranCreerRepas setEcran={setEcran} />}
      {ecran === 'notation' && (
        <EcranNotation setEcran={setEcran} user={user} repasId={repasSelectionne} />
      )}
      {ecran === 'classement' && (
        <EcranClassement setEcran={setEcran} onMessagePrive={ouvrirMessagePrive} />
      )}
      {ecran === 'profil' && <EcranProfil setEcran={setEcran} setUser={setUser} user={user} />}
      {ecran === 'chat' && <EcranChat setEcran={setEcran} user={user} />}
      {ecran === 'chatrepas' && (
        <EcranChatRepas setEcran={setEcran} user={user} repasId={repasChat} />
      )}
      {ecran === 'admin' && user.id === ADMIN_ID && <EcranAdmin setEcran={setEcran} user={user} />}
      {ecran === 'messagesprive' && (
        <EcranMessagesPrive setEcran={setEcran} user={user} membreId={membreMessage} />
      )}
      {['cgu', 'mentions', 'confidentialite'].includes(ecran) && (
        <EcranLegal setEcran={setEcran} page={ecran} />
      )}
      <Nav ecran={ecran} setEcran={setEcran} />
    </div>
  )
}

export default App
