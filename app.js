/**
 * MusculoSoma - Interactive Anatomy Learning Engine
 * Streamlined portal containing 3D explorer, PDF presentation, and quiz with leaderboard ranking.
 */

class AnatomyApp {
  constructor() {
    this.state = {
      activeTab: 'slides-notes', // Land directly on slides tab
      theme: localStorage.getItem('theme') || 'light',

      // Quiz States
      quizActive: false,
      quizTimer: 0,
      quizTimerInterval: null,
      currentQuestionIndex: 0,
      selectedAnswers: Array(10).fill(null),
      userName: '',
    };

    // Muscle database (for explorer)
    this.muscleDb = [
      {
        id: 'anconeus',
        name: 'Anconeus',
        abbrev: 'A',
        group: 'Upper Limb',
        desc: 'A small muscle on the elbow joint, helping in forearm extension.',
        origin: 'Lateral epicondyle of humerus.',
        insertion: 'Lateral olecranon and posterior surface of ulna.',
        action: 'Assists in forearm extension at elbow; abducts ulna during pronation.',
        innervation: 'Radial nerve (C7, C8, T1).'
      },
      {
        id: 'abductor-digiti-minimi',
        name: 'Abductor Digiti Minimi',
        abbrev: 'ADM',
        group: 'Upper Limb',
        desc: 'Located on the ulnar border of the palm, abducting the little finger.',
        origin: 'Pisiform bone and tendon of flexor carpi ulnaris.',
        insertion: 'Ulnar side of base of proximal phalanx of 5th digit.',
        action: 'Abducts the little finger (5th digit).',
        innervation: 'Deep branch of ulnar nerve (C8, T1).'
      },
      {
        id: 'abductor-hallucis',
        name: 'Abductor Hallucis',
        abbrev: 'AH',
        group: 'Lower Body',
        desc: 'A medial foot muscle that abducts and flexes the big toe.',
        origin: 'Medial tubercle of calcaneus and plantar aponeurosis.',
        insertion: 'Medial side of base of proximal phalanx of great toe.',
        action: 'Abducts and flexes the great toe (hallux).',
        innervation: 'Medial plantar nerve (S1, S2).'
      },
      {
        id: 'adductor-longus',
        name: 'Adductor Longus',
        abbrev: 'AL',
        group: 'Lower Body',
        desc: 'A flat triangular hip adductor muscle forming the medial boundary of the femoral triangle.',
        origin: 'Pubis body just inferior to pubic crest.',
        insertion: 'Middle third of linea aspera of femur.',
        action: 'Adduction, flexion, and lateral rotation of thigh at hip joint.',
        innervation: 'Obturator nerve (L2, L3, L4).'
      },
      {
        id: 'adductor-magnus',
        name: 'Adductor Magnus',
        abbrev: 'AM',
        group: 'Lower Body',
        desc: 'A large triangular muscle of the medial thigh, comprising adductor and hamstring portions.',
        origin: 'Inferior ramus of pubis, ramus of ischium, and ischial tuberosity.',
        insertion: 'Gluteal tuberosity, linea aspera, and adductor tubercle of femur.',
        action: 'Powerful adduction of thigh; hamstring portion extends hip.',
        innervation: 'Obturator nerve (L2-L4) and tibial part of sciatic nerve (L4).'
      },
      {
        id: 'acromion-process',
        name: 'Acromion Process',
        abbrev: 'AP',
        group: 'Skeletal Landmarks',
        desc: 'A bony projection on the scapula (shoulder blade) articulating with the clavicle.',
        origin: 'Scapular landmark.',
        insertion: 'Articulates with acromial end of clavicle.',
        action: 'Serves as insertion for trapezius and origin for deltoid muscles.',
        innervation: 'N/A'
      },
      {
        id: 'abductor-pollicis-brevis',
        name: 'Abductor Pollicis Brevis',
        abbrev: 'APB',
        group: 'Upper Limb',
        desc: 'A flat, thin muscle in the hand, forming the lateral part of the thenar eminence.',
        origin: 'Flexor retinaculum, scaphoid, and trapezium bones.',
        insertion: 'Lateral side of base of proximal phalanx of thumb.',
        action: 'Abducts thumb at the metacarpophalangeal joint.',
        innervation: 'Median nerve (C8, T1).'
      },
      {
        id: 'aponeurosis',
        name: 'Aponeurosis',
        abbrev: 'Apo',
        group: 'Connective Tissue',
        desc: 'A sheet of pearly-white fibrous tissue that takes the place of a tendon in sheetlike muscles.',
        origin: 'Connective tissue sheet.',
        insertion: 'Connectes muscle to bone or other muscles.',
        action: 'Distributes muscle tension over a wider area.',
        innervation: 'N/A'
      },
      {
        id: 'abductor-pollicis-longus',
        name: 'Abductor Pollicis Longus',
        abbrev: 'APL',
        group: 'Upper Limb',
        desc: 'A deep forearm muscle that abducts and extends the thumb.',
        origin: 'Posterior surfaces of ulna, radius, and interosseous membrane.',
        insertion: 'Lateral side of base of 1st metacarpal bone (thumb).',
        action: 'Abducts and extends thumb at carpometacarpal joint.',
        innervation: 'Posterior interosseous nerve (radial nerve branch, C7, C8).'
      },
      {
        id: 'anterior-superior-iliac-spine',
        name: 'Anterior Superior Iliac Spine',
        abbrev: 'ASIS',
        group: 'Skeletal Landmarks',
        desc: 'A key bony landmark at the anterior end of the iliac crest on the pelvis.',
        origin: 'Pelvic landmark.',
        insertion: 'Origin for sartorius muscle and tensor fasciae latae.',
        action: 'Serves as attachment point for inguinal ligament.',
        innervation: 'N/A'
      },
      {
        id: 'brachialis',
        name: 'Brachialis',
        abbrev: 'B',
        group: 'Upper Limb',
        desc: 'A muscle of the upper arm lying deep to the biceps brachii, acting as the primary elbow flexor.',
        origin: 'Distal half of anterior humerus.',
        insertion: 'Coronoid process and tuberosity of ulna.',
        action: 'Flexes elbow joint in all forearm positions.',
        innervation: 'Musculocutaneous nerve (C5, C6) and radial nerve branch (C7).'
      },
      {
        id: 'biceps-brachii',
        name: 'Biceps Brachii',
        abbrev: 'BB',
        group: 'Upper Limb',
        desc: 'A two-headed muscle lying on the anterior upper arm, flexing and supinating the forearm.',
        origin: 'Short head: coracoid process. Long head: supraglenoid tubercle of scapula.',
        insertion: 'Radial tuberosity and bicipital aponeurosis.',
        action: 'Flexion of elbow, supination of forearm, and weak flexion of shoulder.',
        innervation: 'Musculocutaneous nerve (C5-C7).'
      },
      {
        id: 'biceps-femoris',
        name: 'Biceps Femoris',
        abbrev: 'BF',
        group: 'Lower Body',
        desc: 'A posterior thigh muscle forming part of the hamstrings, with long and short heads.',
        origin: 'Long head: ischial tuberosity. Short head: lateral lip of linea aspera of femur.',
        insertion: 'Lateral head of fibula and lateral condyle of tibia.',
        action: 'Flexes knee joint; extends and laterally rotates hip (long head).',
        innervation: 'Tibial nerve (long head) and common fibular nerve (short head) (L5-S2).'
      },
      {
        id: 'brachioradialis',
        name: 'Brachioradialis',
        abbrev: 'Br',
        group: 'Upper Limb',
        desc: 'Forearm muscle that flexes forearm at elbow, especially in midpronation.',
        origin: 'Proximal two-thirds of lateral supracondylar ridge of humerus.',
        insertion: 'Lateral side of distal radius near styloid process.',
        action: 'Flexes forearm at elbow joint.',
        innervation: 'Radial nerve (C5-C7).'
      },
      {
        id: 'buccinator',
        name: 'Buccinator',
        abbrev: 'Bu',
        group: 'Head & Neck',
        desc: 'The principal muscle of the cheek, pulling the cheek in against the teeth.',
        origin: 'Alveolar processes of maxilla and mandible, pterygomandibular raphe.',
        insertion: 'Angle of mouth (orbicularis oris fibers).',
        action: 'Flattens cheek, holds food between teeth during mastication; assists in blowing.',
        innervation: 'Buccal branch of facial nerve (CN VII).'
      },
      {
        id: 'coracobrachialis',
        name: 'Coracobrachialis',
        abbrev: 'C',
        group: 'Upper Limb',
        desc: 'A slender muscle in the superomedial part of the arm.',
        origin: 'Coracoid process of scapula.',
        insertion: 'Medial side of humeral shaft (middle third).',
        action: 'Flexion and adduction of arm at shoulder joint.',
        innervation: 'Musculocutaneous nerve (C5, C6, C7).'
      },
      {
        id: 'c7-vertebrae',
        name: 'Seventh Cervical Vertebrae',
        abbrev: 'C7',
        group: 'Skeletal Landmarks',
        desc: 'The lowest of the cervical vertebrae, featuring a prominent spinous process (vertebra prominens).',
        origin: 'Spine segment.',
        insertion: 'Articulates with T1 and C6 vertebrae.',
        action: 'Supports skull; attachment point for ligamentum nuchae and trapezius.',
        innervation: 'N/A'
      },
      {
        id: 'calcaneus',
        name: 'Calcaneus',
        abbrev: 'Ca',
        group: 'Skeletal Landmarks',
        desc: 'The heel bone, which is the largest bone of the foot.',
        origin: 'Tarsal bone.',
        insertion: 'Insertion point for Gastrocnemius, Soleus, and Plantaris via Achilles tendon.',
        action: 'Supports body weight and transmits forces during walking.',
        innervation: 'N/A'
      },
      {
        id: 'clavicles',
        name: 'Clavicles',
        abbrev: 'CL',
        group: 'Skeletal Landmarks',
        desc: 'The collarbones, connecting the upper limb to the trunk.',
        origin: 'Pectoral girdle bone.',
        insertion: 'Articulates with sternum medially and acromion laterally.',
        action: 'Acts as structural brace keeping arm away from thorax; muscle attachments.',
        innervation: 'N/A'
      },
      {
        id: 'deltoids',
        name: 'Deltoids',
        abbrev: 'D',
        group: 'Upper Limb',
        desc: 'A large, triangular shoulder muscle covering the glenohumeral joint.',
        origin: 'Lateral third of clavicle, acromion, and spine of scapula.',
        insertion: 'Deltoid tuberosity of humerus.',
        action: 'Abduction of arm (primary); flexion/medial rotation (anterior); extension/lateral rotation (posterior).',
        innervation: 'Axillary nerve (C5, C6).'
      },
      {
        id: 'digastric-anterior-belly',
        name: 'Digastric Anterior Belly',
        abbrev: 'DAB',
        group: 'Head & Neck',
        desc: 'Anterior portion of the digastric muscle, running under the jaw.',
        origin: 'Digastric fossa of mandible.',
        insertion: 'Intermediate tendon of hyoid bone.',
        action: 'Depresses mandible (opens mouth) and elevates hyoid bone.',
        innervation: 'Nerve to mylohyoid (trigeminal nerve mandibular branch V3).'
      },
      {
        id: 'depressor-anguli-oris',
        name: 'Depressor Anguli Oris',
        abbrev: 'DAO',
        group: 'Head & Neck',
        desc: 'A facial muscle associated with frowning, drawing the corners of the mouth downward.',
        origin: 'Oblique line of mandible.',
        insertion: 'Modiolus of mouth.',
        action: 'Depresses angle of mouth (corners) down and laterally.',
        innervation: 'Marginal mandibular branch of facial nerve (CN VII).'
      },
      {
        id: 'depressor-labii-inferioris',
        name: 'Depressor Labii Inferioris',
        abbrev: 'DLI',
        group: 'Head & Neck',
        desc: 'A small muscle of the lower lip that depresses it.',
        origin: 'Anterior mandible, medial to depressor anguli oris.',
        insertion: 'Skin and mucosa of lower lip.',
        action: 'Depresses and draws lower lip downward and laterally.',
        innervation: 'Marginal mandibular branch of facial nerve (CN VII).'
      },
      {
        id: 'digastric-posterior-belly',
        name: 'Digastric Posterior Belly',
        abbrev: 'DPB',
        group: 'Head & Neck',
        desc: 'Posterior portion of the digastric muscle, extending from the mastoid area.',
        origin: 'Mastoid notch of temporal bone.',
        insertion: 'Intermediate tendon of hyoid bone.',
        action: 'Elevates hyoid bone and pulls it backward.',
        innervation: 'Digastric branch of facial nerve (CN VII).'
      },
      {
        id: 'depressor-supercilii',
        name: 'Depressor Supercilii',
        abbrev: 'DS',
        group: 'Head & Neck',
        desc: 'An eye-area muscle that lowers the eyebrow.',
        origin: 'Nasal part of frontal bone and medial orbital rim.',
        insertion: 'Medial aspect of eyebrow skin.',
        action: 'Depresses the eyebrow.',
        innervation: 'Temporal branch of facial nerve (CN VII).'
      },
      {
        id: 'extensor-carpi-radialis-brevis',
        name: 'Extensor Carpi Radialis Brevis',
        abbrev: 'ECRB',
        group: 'Upper Limb',
        desc: 'A forearm muscle that extends and abducts the wrist.',
        origin: 'Lateral epicondyle of humerus.',
        insertion: 'Base of metacarpal 3 (posterior surface).',
        action: 'Extends and abducts (radial deviation) hand at wrist joint.',
        innervation: 'Deep branch of radial nerve (C7, C8).'
      },
      {
        id: 'extensor-carpi-radialis-longus',
        name: 'Extensor Carpi Radialis Longus',
        abbrev: 'ECRL',
        group: 'Upper Limb',
        desc: 'A forearm muscle extending and abducting the wrist, running parallel to the brevis.',
        origin: 'Lateral supracondylar ridge of humerus.',
        insertion: 'Base of metacarpal 2 (posterior surface).',
        action: 'Extends and abducts hand at wrist joint.',
        innervation: 'Radial nerve (C6, C7).'
      },
      {
        id: 'extensor-carpi-ulnaris',
        name: 'Extensor Carpi Ulnaris',
        abbrev: 'ECU',
        group: 'Upper Limb',
        desc: 'A forearm muscle on the ulnar side, extending and adducting the wrist.',
        origin: 'Lateral epicondyle of humerus and posterior border of ulna.',
        insertion: 'Base of metacarpal 5.',
        action: 'Extends and adducts (ulnar deviation) hand at wrist joint.',
        innervation: 'Posterior interosseous nerve (radial nerve branch, C7, C8).'
      },
      {
        id: 'extensor-digitorum',
        name: 'Extensor Digitorum',
        abbrev: 'ED',
        group: 'Upper Limb',
        desc: 'A superficial muscle of the posterior forearm extending the medial four fingers.',
        origin: 'Lateral epicondyle of humerus.',
        insertion: 'Extensor expansions of digits 2-5.',
        action: 'Extends medial four digits at MCP, PIP, and DIP joints; extends wrist.',
        innervation: 'Posterior interosseous nerve (radial nerve branch, C7, C8).'
      },
      {
        id: 'extensor-digitorum-brevis',
        name: 'Extensor Digitorum Brevis',
        abbrev: 'EDB',
        group: 'Lower Body',
        desc: 'A muscle on the dorsal aspect of the foot that extends toes 2-4.',
        origin: 'Superolateral surface of calcaneus.',
        insertion: 'Extensor digitorum longus tendons of toes 2-4.',
        action: 'Aids in extending toes 2-4.',
        innervation: 'Deep fibular nerve (L5, S1).'
      },
      {
        id: 'extensor-digitorum-longus',
        name: 'Extensor Digitorum Longus',
        abbrev: 'EDL',
        group: 'Lower Body',
        desc: 'A feather-like muscle of the anterior leg that dorsiflexes the foot and extends toes 2-5.',
        origin: 'Lateral condyle of tibia, proximal shaft of fibula, and interosseous membrane.',
        insertion: 'Middle and distal phalanges of toes 2-5.',
        action: 'Extends toes 2-5; dorsiflexes foot at ankle.',
        innervation: 'Deep fibular nerve (L4, L5, S1).'
      },
      {
        id: 'extensor-digiti-minimi',
        name: 'Extensor Digiti Minimi',
        abbrev: 'EDM',
        group: 'Upper Limb',
        desc: 'A slender forearm muscle extending the little finger.',
        origin: 'Lateral epicondyle of humerus (common extensor tendon).',
        insertion: 'Extensor expansion of 5th digit.',
        action: 'Extends little finger (5th digit) and assists wrist extension.',
        innervation: 'Posterior interosseous nerve (radial nerve branch, C7, C8).'
      },
      {
        id: 'external-oblique',
        name: 'External Oblique',
        abbrev: 'EO',
        group: 'Core & Trunk',
        desc: 'Outer abdominal muscle compressing the abdomen and rotating the torso.',
        origin: 'External surfaces of ribs 5-12.',
        insertion: 'Linea alba, pubic tubercle, and anterior half of iliac crest.',
        action: 'Flexes and rotates vertebral column; compresses abdominal wall.',
        innervation: 'Thoracoabdominal nerves (T7-T11) and subcostal nerve (T12).'
      },
      {
        id: 'extensor-pollicis-brevis',
        name: 'Extensor Pollicis Brevis',
        abbrev: 'EPB',
        group: 'Upper Limb',
        desc: 'A deep forearm muscle that extends the thumb.',
        origin: 'Posterior surface of radius and interosseous membrane.',
        insertion: 'Base of proximal phalanx of thumb.',
        action: 'Extends thumb at metacarpophalangeal joint.',
        innervation: 'Posterior interosseous nerve (radial nerve branch, C7, C8).'
      },
      {
        id: 'erector-spinae',
        name: 'Erector Spinae',
        abbrev: 'ES',
        group: 'Core & Trunk',
        desc: 'A vertical bundle of muscle groups along the spine, critical for posture.',
        origin: 'Sacrum, iliac crest, and lumbar/thoracic spinous processes.',
        insertion: 'Ribs, transverse/spinous processes of vertebrae, and occipital bone.',
        action: 'Extends vertebral column and controls lateral flexion.',
        innervation: 'Posterior rami of spinal nerves.'
      },
      {
        id: 'frontalis',
        name: 'Frontalis',
        abbrev: 'F',
        group: 'Head & Neck',
        desc: 'The frontal belly of the epicranius muscle, raising the eyebrows.',
        origin: 'Epicranial aponeurosis.',
        insertion: 'Skin of eyebrows and root of nose.',
        action: 'Raises eyebrows and wrinkles skin of forehead.',
        innervation: 'Temporal branch of facial nerve (CN VII).'
      },
      {
        id: 'flexor-carpi-ulnaris',
        name: 'Flexor Carpi Ulnaris',
        abbrev: 'FCU',
        group: 'Upper Limb',
        desc: 'A forearm muscle on the ulnar side flexing and adducting the hand.',
        origin: 'Humeral head (medial epicondyle) and ulnar head (olecranon and posterior boundary).',
        insertion: 'Pisiform, hamate, and 5th metacarpal base.',
        action: 'Flexes and adducts hand at wrist joint.',
        innervation: 'Ulnar nerve (C7, C8, T1).'
      },
      {
        id: 'flexor-carpi-radialis',
        name: 'Flexor Carpi Radialis',
        abbrev: 'FCR',
        group: 'Upper Limb',
        desc: 'A forearm muscle on the radial side flexing and abducting the hand.',
        origin: 'Medial epicondyle of humerus.',
        insertion: 'Bases of metacarpals 2 and 3.',
        action: 'Flexes and abducts hand at wrist joint.',
        innervation: 'Median nerve (C6, C7).'
      },
      {
        id: 'first-dorsal-interosseous',
        name: 'First Dorsal Interosseous',
        abbrev: 'FDI',
        group: 'Upper Limb',
        desc: 'A muscle between index finger and thumb that abducts the index finger.',
        origin: 'Adjacent sides of 1st and 2nd metacarpal bones.',
        insertion: 'Radial side of base of proximal phalanx of index finger.',
        action: 'Abducts index finger; flexes MCP and extends IP joints of index finger.',
        innervation: 'Deep branch of ulnar nerve (C8, T1).'
      },
      {
        id: 'flexor-digitorum-longus',
        name: 'Flexor Digitorum Longus',
        abbrev: 'FDL',
        group: 'Lower Body',
        desc: 'A posterior leg muscle flexing the lateral four toes.',
        origin: 'Posterior surface of tibia.',
        insertion: 'Bases of distal phalanges of toes 2-5.',
        action: 'Flexes toes 2-5; plantar flexes foot and supports arches.',
        innervation: 'Tibial nerve (L5, S1, S2).'
      },
      {
        id: 'flexor-digitorum-superficialis',
        name: 'Flexor Digitorum Superficialis',
        abbrev: 'FDS',
        group: 'Upper Limb',
        desc: 'An intermediate forearm flexor muscle flexing digits 2-5.',
        origin: 'Humero-ulnar head (medial epicondyle and coronoid) and radial head.',
        insertion: 'Middle phalanges of digits 2-5.',
        action: 'Flexes middle phalanges of digits 2-5; flexes wrist.',
        innervation: 'Median nerve (C7, C8, T1).'
      },
      {
        id: 'femur',
        name: 'Femur',
        abbrev: 'Fe',
        group: 'Skeletal Landmarks',
        desc: 'The thigh bone, the longest and strongest bone in the body.',
        origin: 'Thigh skeletal segment.',
        insertion: 'Articulates with acetabulum of hip and tibia/patella of knee.',
        action: 'Supports body weight and acts as primary skeletal lever for locomotion.',
        innervation: 'N/A'
      },
      {
        id: 'gracilis',
        name: 'Gracilis',
        abbrev: 'G',
        group: 'Lower Body',
        desc: 'A long, slender muscle on the medial thigh adducting the hip.',
        origin: 'Inferior ramus and body of pubis.',
        insertion: 'Medial surface of proximal tibia (pes anserinus).',
        action: 'Adducts hip, flexes knee, and assists in medial rotation of knee.',
        innervation: 'Obturator nerve (L2, L3).'
      },
      {
        id: 'gastrocnemius',
        name: 'Gastrocnemius',
        abbrev: 'Ga',
        group: 'Lower Body',
        desc: 'The superficial calf muscle forming the posterior prominence of the lower leg.',
        origin: 'Medial and lateral condyles of femur.',
        insertion: 'Calcaneus via Achilles tendon.',
        action: 'Plantar flexes foot and flexes knee joint.',
        innervation: 'Tibial nerve (S1, S2).'
      },
      {
        id: 'greater-trochanter',
        name: 'Greater Trochanter',
        abbrev: 'GT',
        group: 'Skeletal Landmarks',
        desc: 'A large, irregular bony projection on the lateral proximal femur.',
        origin: 'Femur landmark.',
        insertion: 'Insertion for gluteus medius, minimus, and piriformis.',
        action: 'Acts as lever for hip abductor and rotator muscles.',
        innervation: 'N/A'
      },
      {
        id: 'gastrocnemius-tendon',
        name: 'Gastrocnemius Tendon',
        abbrev: 'GTe',
        group: 'Connective Tissue',
        desc: 'The thick fibrous band connecting calf muscles to the heel bone (Achilles tendon).',
        origin: 'Calf muscle junction.',
        insertion: 'Posterior surface of calcaneus.',
        action: 'Transmits forces from gastrocnemius/soleus to plantar flex the foot.',
        innervation: 'N/A'
      },
      {
        id: 'fibula-head',
        name: 'Fibula Head',
        abbrev: 'FH',
        group: 'Skeletal Landmarks',
        desc: 'The rounded upper extremity of the fibula lateral to the knee.',
        origin: 'Lower limb skeletal landmark.',
        insertion: 'Insertion for biceps femoris and fibular collateral ligament.',
        action: 'Stabilizes ankle girdle; muscular attachment point.',
        innervation: 'N/A'
      },
      {
        id: 'iliopsas',
        name: 'Iliopsas',
        abbrev: 'I',
        group: 'Lower Body',
        desc: 'Refers to the combined iliacus and psoas muscles, acting as the primary hip flexor.',
        origin: 'Iliac fossa (iliacus) and lumbar vertebrae (psoas).',
        insertion: 'Lesser trochanter of femur.',
        action: 'Flexes thigh at hip joint.',
        innervation: 'Femoral nerve (L2-L4) and lumbar plexus branches.'
      },
      {
        id: 'ilium-crest',
        name: 'Ilium Crest',
        abbrev: 'IC',
        group: 'Skeletal Landmarks',
        desc: 'The curved superior border of the ilium (upper margin of hip bone).',
        origin: 'Pelvis landmark.',
        insertion: 'Attachment for external oblique, internal oblique, and latissimus dorsi.',
        action: 'Provides structural support for pelvis; muscle anchoring.',
        innervation: 'N/A'
      },
      {
        id: 'infraspinatus',
        name: 'Infraspinatus',
        abbrev: 'In',
        group: 'Upper Limb',
        desc: 'A thick triangular rotator cuff muscle on the back of the scapula.',
        origin: 'Infraspinous fossa of scapula.',
        insertion: 'Greater tubercle of humerus.',
        action: 'Laterally rotates arm and stabilizes shoulder joint.',
        innervation: 'Suprascapular nerve (C5, C6).'
      },
      {
        id: 'iliotibial-tract',
        name: 'Iliotibial Tract',
        abbrev: 'IT',
        group: 'Connective Tissue',
        desc: 'A thick band of fascia running down the lateral thigh (IT band).',
        origin: 'Iliac crest (originating from TFL and Gluteus Maximus).',
        insertion: 'Lateral condyle of tibia (Gerdy\'s tubercle).',
        action: 'Stabilizes knee and hip joints during locomotion.',
        innervation: 'N/A'
      },
      {
        id: 'latissimus-dorsi',
        name: 'Latissimus Dorsi',
        abbrev: 'LD',
        group: 'Core & Trunk',
        desc: 'The broadest back muscle, driving shoulder extension and adduction.',
        origin: 'Spinous processes of T7-L5, thoracolumbar fascia, and iliac crest.',
        insertion: 'Floor of intertubercular groove of humerus.',
        action: 'Extension, adduction, and medial rotation of arm at shoulder joint.',
        innervation: 'Thoracodorsal nerve (C6-C8).'
      },
      {
        id: 'lateral-epicondyle',
        name: 'Lateral Epicondyle',
        abbrev: 'LE',
        group: 'Skeletal Landmarks',
        desc: 'A small, tuberculated projection on the outer distal humerus.',
        origin: 'Humerus landmark.',
        insertion: 'Origin for common extensor tendon of forearm.',
        action: 'Provides attachment for radial collateral ligament and forearm extensors.',
        innervation: 'N/A'
      },
      {
        id: 'levator-labii-superioris',
        name: 'Levator Labii Superioris',
        abbrev: 'LLS',
        group: 'Head & Neck',
        desc: 'A facial muscle that elevates the upper lip.',
        origin: 'Inferior margin of orbit, superior to infraorbital foramen.',
        insertion: 'Skin and muscular tissue of upper lip.',
        action: 'Elevates upper lip.',
        innervation: 'Zygomatic branch of facial nerve (CN VII).'
      },
      {
        id: 'levator-labii-superioris-alaeque-nasi',
        name: 'Levator Labii Superioris Alaeque Nasi',
        abbrev: 'LLSAN',
        group: 'Head & Neck',
        desc: 'A facial muscle that dilates the nostril and flares the lip.',
        origin: 'Frontal process of maxilla.',
        insertion: 'Alar cartilage of nose and skin of upper lip.',
        action: 'Elevates upper lip and dilates nostril (causes snarling expression).',
        innervation: 'Zygomatic branch of facial nerve (CN VII).'
      },
      {
        id: 'lateral-malleolus',
        name: 'Lateral Malleolus',
        abbrev: 'LM',
        group: 'Skeletal Landmarks',
        desc: 'The bony projection on the lateral side of the ankle (distal end of fibula).',
        origin: 'Fibula landmark.',
        insertion: 'Articulates with talus.',
        action: 'Formulates lateral ankle joint margin; anchor for lateral ankle ligaments.',
        innervation: 'N/A'
      },
      {
        id: 'labial-platysma',
        name: 'Labial Platysma',
        abbrev: 'LP',
        group: 'Head & Neck',
        desc: 'Fibers of platysma attaching to the mandible and lip.',
        origin: 'Fascia of chest and shoulder.',
        insertion: 'Lower border of mandible and skin of lower face.',
        action: 'Depresses lower jaw, pulls down corners of mouth.',
        innervation: 'Cervical branch of facial nerve (CN VII).'
      },
      {
        id: 'levator-scapulae',
        name: 'Levator Scapulae',
        abbrev: 'LS',
        group: 'Core & Trunk',
        desc: 'A posterior neck muscle that lifts the shoulder blade.',
        origin: 'Transverse processes of vertebrae C1-C4.',
        insertion: 'Superior angle and medial border of scapula.',
        action: 'Elevates scapula and rotates its glenoid cavity inferiorly.',
        innervation: 'Dorsal scapular nerve (C5) and cervical nerves (C3, C4).'
      },
      {
        id: 'mylohyiod',
        name: 'Mylohyiod',
        abbrev: 'M',
        group: 'Head & Neck',
        desc: 'A flat muscle forming the floor of the mouth cavity.',
        origin: 'Mylohyoid line of mandible.',
        insertion: 'Body of hyoid bone and median raphe.',
        action: 'Elevates hyoid bone and floor of mouth; assists tongue movement and swallowing.',
        innervation: 'Nerve to mylohyoid (trigeminal V3).'
      },
      {
        id: 'masseter',
        name: 'Masseter',
        abbrev: 'Ma',
        group: 'Head & Neck',
        desc: 'The thick jaw muscle driving mastication and teeth clenching.',
        origin: 'Zygomatic arch and maxillary process.',
        insertion: 'Angle and lateral surface of ramus of mandible.',
        action: 'Elevates and protracts mandible (closes jaw).',
        innervation: 'Masseteric nerve (trigeminal V3).'
      },
      {
        id: 'manubrium',
        name: 'Manubrium',
        abbrev: 'Man',
        group: 'Skeletal Landmarks',
        desc: 'The broad upper segment of the sternum (breastbone).',
        origin: 'Thoracic skeletal landmark.',
        insertion: 'Articulates with clavicles and 1st/2nd costal cartilages.',
        action: 'Shields mediastinum; anchor for sternocleidomastoid muscle.',
        innervation: 'N/A'
      },
      {
        id: 'medial-epicondyle',
        name: 'Medial Epicondyle',
        abbrev: 'ME',
        group: 'Skeletal Landmarks',
        desc: 'A prominent bony projection on the medial distal humerus.',
        origin: 'Humerus landmark.',
        insertion: 'Origin for common flexor tendon of forearm.',
        action: 'Attachment for ulnar collateral ligament and forearm flexors.',
        innervation: 'N/A'
      },
      {
        id: 'mentalis',
        name: 'Mentalis',
        abbrev: 'Men',
        group: 'Head & Neck',
        desc: 'A central muscle of the chin that pouts the lower lip.',
        origin: 'Incisive fossa of mandible.',
        insertion: 'Skin of chin.',
        action: 'Elevates and wrinkles skin of chin; protrudes lower lip.',
        innervation: 'Marginal mandibular branch of facial nerve (CN VII).'
      },
      {
        id: 'medial-malleolus',
        name: 'Medial Malleolus',
        abbrev: 'MM',
        group: 'Skeletal Landmarks',
        desc: 'The bony projection on the medial side of the ankle (distal end of tibia).',
        origin: 'Tibia landmark.',
        insertion: 'Articulates with talus.',
        action: 'Formulates medial ankle joint margin; anchor for deltoid ligament.',
        innervation: 'N/A'
      },
      {
        id: 'node',
        name: 'Node',
        abbrev: 'N',
        group: 'Other',
        desc: 'Anatomical reference node or lymph node region.',
        origin: 'N/A',
        insertion: 'N/A',
        action: 'Serves as point of anatomical interest in head-neck anatomy.',
        innervation: 'N/A'
      },
      {
        id: 'nasalis',
        name: 'Nasalis',
        abbrev: 'Na',
        group: 'Head & Neck',
        desc: 'A nose muscle responsible for flaring or compressing nostrils.',
        origin: 'Maxilla, adjacent to nasal notch.',
        insertion: 'Aponeurosis over nasal bridge (transverse part); alar cartilage (alar part).',
        action: 'Compresses nasal aperture (transverse part); dilates nostril (alar part).',
        innervation: 'Buccal branch of facial nerve (CN VII).'
      },
      {
        id: 'olecranon',
        name: 'Olecranon',
        abbrev: 'O',
        group: 'Skeletal Landmarks',
        desc: 'The large bony process of the ulna projecting behind the elbow joint.',
        origin: 'Ulna landmark.',
        insertion: 'Insertion point for triceps brachii muscle.',
        action: 'Formulates bony tip of elbow; prevents hyperextension.',
        innervation: 'N/A'
      },
      {
        id: 'occipitalis',
        name: 'Occipitalis',
        abbrev: 'Oc',
        group: 'Head & Neck',
        desc: 'The posterior belly of the epicranius muscle, pulling the scalp backwards.',
        origin: 'Superior nuchal line of occipital bone.',
        insertion: 'Epicranial aponeurosis.',
        action: 'Pulls scalp posteriorly.',
        innervation: 'Posterior auricular branch of facial nerve (CN VII).'
      },
      {
        id: 'omohyoid',
        name: 'Omohyoid',
        abbrev: 'Om',
        group: 'Head & Neck',
        desc: 'A double-bellied infrahyoid muscle depressing the hyoid bone.',
        origin: 'Superior border of scapula.',
        insertion: 'Lower border of body of hyoid bone.',
        action: 'Depresses and retracts hyoid bone and larynx.',
        innervation: 'Ansa cervicalis (cervical plexus C1-C3).'
      },
      {
        id: 'orbicularis-oris',
        name: 'Orbicularis Oris',
        abbrev: 'OO',
        group: 'Head & Neck',
        desc: 'A complex circular facial muscle surrounding the mouth opening.',
        origin: 'Maxilla and mandible (medial fibers); other facial muscles.',
        insertion: 'Skin and mucous membrane of lips.',
        action: 'Closes, puckers, and protrudes lips (the "kissing muscle").',
        innervation: 'Buccal and mandibular branches of facial nerve (CN VII).'
      },
      {
        id: 'orbicularis-oculi',
        name: 'Orbicularis Oculi',
        abbrev: 'OOc',
        group: 'Head & Neck',
        desc: 'A ring-like muscle surrounding the orbit of the eye.',
        origin: 'Frontal bone, medial palpebral ligament, and lacrimal bone.',
        insertion: 'Lateral palpebral raphe and skin surrounding orbital rim.',
        action: 'Closes eyelids (blinking, squinting, sleeping).',
        innervation: 'Temporal and zygomatic branches of facial nerve (CN VII).'
      },
      {
        id: 'procerus',
        name: 'Procerus',
        abbrev: 'P',
        group: 'Head & Neck',
        desc: 'A small pyramidal muscle between the eyebrows, drawing them down.',
        origin: 'Fascia over lower nasal bone.',
        insertion: 'Skin of lower forehead between eyebrows.',
        action: 'Pulls down medial eyebrows; wrinkles skin of nose (frowning/sneering).',
        innervation: 'Temporal/buccal branches of facial nerve (CN VII).'
      },
      {
        id: 'pectineus',
        name: 'Pectineus',
        abbrev: 'Pe',
        group: 'Lower Body',
        desc: 'A flat quadrangular muscle in the groin flexing and adducting the hip.',
        origin: 'Pectineal line of pubis.',
        insertion: 'Pectineal line of femur.',
        action: 'Flexes and adducts thigh at hip joint.',
        innervation: 'Femoral nerve (L2, L3) and obturator nerve.'
      },
      {
        id: 'patella',
        name: 'Patella',
        abbrev: 'Pa',
        group: 'Skeletal Landmarks',
        desc: 'The kneecap, a thick triangular sesamoid bone protecting the knee joint.',
        origin: 'Knee joint skeletal landmark.',
        insertion: 'Insertion for quadriceps tendon; origin for patellar ligament.',
        action: 'Increases leverage of quadriceps tendon during knee extension.',
        innervation: 'N/A'
      },
      {
        id: 'peroneus-brevis',
        name: 'Peroneus Brevis',
        abbrev: 'PB',
        group: 'Lower Body',
        desc: 'A lateral compartment leg muscle aiding in foot eversion.',
        origin: 'Distal two-thirds of lateral shaft of fibula.',
        insertion: 'Tuberosity of 5th metacarpal base (foot).',
        action: 'Everts foot and assists in plantar flexion of ankle.',
        innervation: 'Superficial fibular nerve (L5, S1).'
      },
      {
        id: 'peroneus-longus',
        name: 'Peroneus Longus',
        abbrev: 'PL',
        group: 'Lower Body',
        desc: 'A superficial muscle in lateral compartment of leg everting the foot.',
        origin: 'Head and proximal two-thirds of lateral shaft of fibula.',
        insertion: 'Medial cuneiform and base of 1st metatarsal (under plantar foot).',
        action: 'Everts foot and assists in plantar flexion of ankle.',
        innervation: 'Superficial fibular nerve (L5, S1).'
      },
      {
        id: 'palmaris-longus',
        name: 'Palmaris Longus',
        abbrev: 'PLo',
        group: 'Upper Limb',
        desc: 'A superficial forearm muscle with a long slender tendon, absent in ~14% of people.',
        origin: 'Medial epicondyle of humerus.',
        insertion: 'Palmar aponeurosis and flexor retinaculum.',
        action: 'Weak flexor of hand at wrist joint; tenses palmar fascia.',
        innervation: 'Median nerve (C7, C8).'
      },
      {
        id: 'pectoralis-major',
        name: 'Pectoralis Major',
        abbrev: 'PM',
        group: 'Core & Trunk',
        desc: 'The main chest muscle driving arm adduction, flexion, and medial rotation.',
        origin: 'Medial clavicle, sternum, and ribs 1-6.',
        insertion: 'Lateral lip of intertubercular sulcus of humerus.',
        action: 'Adducts, flexes, and medially rotates shoulder joint.',
        innervation: 'Lateral and medial pectoral nerves (C5-T1).'
      },
      {
        id: 'pubic-symphysis',
        name: 'Pubic Symphysis',
        abbrev: 'PS',
        group: 'Skeletal Landmarks',
        desc: 'The midline cartilaginous joint uniting left and right pubic bones.',
        origin: 'Pelvis medial skeletal landmark.',
        insertion: 'Joint margins.',
        action: 'Provides stability and minor mobility to anterior pelvic ring.',
        innervation: 'N/A'
      },
      {
        id: 'peroneus-tertius',
        name: 'Peroneus Tertius',
        abbrev: 'PT',
        group: 'Lower Body',
        desc: 'A small anterior compartment leg muscle everting the foot.',
        origin: 'Distal third of anterior surface of fibula.',
        insertion: 'Dorsal surface of base of 5th metatarsal.',
        action: 'Dorsiflexes and everts foot at ankle joint.',
        innervation: 'Deep fibular nerve (L5, S1).'
      },
      {
        id: 'pronator-teres',
        name: 'Pronator Teres',
        abbrev: 'PTe',
        group: 'Upper Limb',
        desc: 'A forearm muscle driving pronation (turning palm downward).',
        origin: 'Medial epicondyle of humerus and coronoid process of ulna.',
        insertion: 'Middle of lateral surface of radius.',
        action: 'Pronates forearm and assists in elbow flexion.',
        innervation: 'Median nerve (C6, C7).'
      },
      {
        id: 'posterior-superior-iliac-spine',
        name: 'Posterior Superior Iliac Spine',
        abbrev: 'PSIS',
        group: 'Skeletal Landmarks',
        desc: 'A bony projection at the posterior end of the iliac crest (seen as skin dimples).',
        origin: 'Pelvis posterior landmark.',
        insertion: 'Attachment for posterior sacroiliac ligaments.',
        action: 'Serves as landmark for spine/hip clinical evaluations.',
        innervation: 'N/A'
      },
      {
        id: 'rhomboids',
        name: 'Rhomboids',
        abbrev: 'R',
        group: 'Core & Trunk',
        desc: 'Includes rhomboid major and minor, drawing scapula toward spine.',
        origin: 'Spinous processes of vertebrae C7-T5.',
        insertion: 'Medial border of scapula.',
        action: 'Retracts (adducts) and elevates scapula; stabilizes shoulder girdle.',
        innervation: 'Dorsal scapular nerve (C5).'
      },
      {
        id: 'rectus-abdominis',
        name: 'Rectus Abdominis',
        abbrev: 'RA',
        group: 'Core & Trunk',
        desc: 'The long, vertical abdominal muscle flexing the spine.',
        origin: 'Pubic crest and symphysis.',
        insertion: 'Xiphoid process and costal cartilages of ribs 5-7.',
        action: 'Flexes lumbar spine; compresses abdomen to support viscera.',
        innervation: 'Thoracoabdominal nerves (T7-T12).'
      },
      {
        id: 'rectus-femoris',
        name: 'Rectus Femoris',
        abbrev: 'RF',
        group: 'Lower Body',
        desc: 'A double-jointed quadriceps muscle flexing the hip and extending the knee.',
        origin: 'Anterior inferior iliac spine (AIIS) and acetabular rim.',
        insertion: 'Patella and tibial tuberosity via patellar ligament.',
        action: 'Extends knee; flexes thigh at hip joint.',
        innervation: 'Femoral nerve (L2-L4).'
      },
      {
        id: 'sartorius',
        name: 'Sartorius',
        abbrev: 'S',
        group: 'Lower Body',
        desc: 'The longest skeletal muscle, running obliquely across anterior thigh.',
        origin: 'Anterior superior iliac spine (ASIS).',
        insertion: 'Medial surface of proximal tibia (pes anserinus).',
        action: 'Flexes, abducts, and laterally rotates hip; flexes knee.',
        innervation: 'Femoral nerve (L2, L3).'
      },
      {
        id: 'serratus-anterior',
        name: 'Serratus Anterior',
        abbrev: 'SA',
        group: 'Core & Trunk',
        desc: 'A fan-shaped muscle on lateral wall of thorax (the "boxer\'s muscle").',
        origin: 'External surfaces of ribs 1-8 (or 9).',
        insertion: 'Anterior/medial border of scapula.',
        action: 'Protracts and stabilizes scapula; rotates scapula upward.',
        innervation: 'Long thoracic nerve (C5-C7).'
      },
      {
        id: 'splenius-capitis',
        name: 'Splenius Capitis',
        abbrev: 'SC',
        group: 'Head & Neck',
        desc: 'A broad band-like muscle at the back of the neck.',
        origin: 'Lower ligamentum nuchae and spinous processes of C7-T3.',
        insertion: 'Mastoid process of temporal bone and superior nuchal line.',
        action: 'Bilateral: extends head/neck. Unilateral: laterally flexes and rotates head to same side.',
        innervation: 'Posterior rami of middle cervical nerves.'
      },
      {
        id: 'semispinalis-capitis',
        name: 'Semispinalis Capitis',
        abbrev: 'SCa',
        group: 'Head & Neck',
        desc: 'A deep muscle of the neck lying beneath splenius capitis.',
        origin: 'Transverse processes of C7-T6 and articular processes of C4-C6.',
        insertion: 'Occipital bone between superior and inferior nuchal lines.',
        action: 'Extends head and neck; rotates to opposite side.',
        innervation: 'Greater occipital nerve (C2) and C3 nerve.'
      },
      {
        id: 'semitendinosus',
        name: 'Semitendinosus',
        abbrev: 'Se',
        group: 'Lower Body',
        desc: 'A posterior hamstring muscle with a long cord-like tendon.',
        origin: 'Ischial tuberosity.',
        insertion: 'Medial proximal tibia (pes anserinus).',
        action: 'Flexes knee joint; extends hip joint.',
        innervation: 'Tibial nerve branch of sciatic nerve (L5-S2).'
      },
      {
        id: 'scalenus-medius',
        name: 'Scalenus Medius',
        abbrev: 'SM',
        group: 'Head & Neck',
        desc: 'The largest of the scalene muscles, located on the side of the neck.',
        origin: 'Transverse processes of cervical vertebrae C2-C7.',
        insertion: 'Superior surface of 1st rib (posterior to scalene tubercle).',
        action: 'Elevates 1st rib (assists inspiration); laterally flexes neck.',
        innervation: 'Anterior rami of cervical nerves C3-C8.'
      },
      {
        id: 'soleus',
        name: 'Soleus',
        abbrev: 'So',
        group: 'Lower Body',
        desc: 'A broad, flat muscle located deep to the gastrocnemius in the calf.',
        origin: 'Soleal line of tibia and posterior fibula head.',
        insertion: 'Calcaneus via Achilles tendon.',
        action: 'Plantar flexes foot at ankle joint (essential for posture).',
        innervation: 'Tibial nerve (S1, S2).'
      },
      {
        id: 'styloid-process',
        name: 'Styloid Process',
        abbrev: 'SP',
        group: 'Skeletal Landmarks',
        desc: 'A slender pointed projection of bone (e.g. on temporal bone, radius, or ulna).',
        origin: 'Skeletal landmark projection.',
        insertion: 'Point of origin/insertion for stylohyoid, styloglossus, and stylopharyngeus.',
        action: 'Anchors stylomandibular and stylohyoid ligaments.',
        innervation: 'N/A'
      },
      {
        id: 'scapula-spine',
        name: 'Scapula Spine',
        abbrev: 'SS',
        group: 'Skeletal Landmarks',
        desc: 'A prominent plate of bone crossing the upper scapula back horizontally.',
        origin: 'Scapular skeletal ridge.',
        insertion: 'Insertion for trapezius; origin for deltoid.',
        action: 'Divides scapula back into supra- and infraspinous fossae.',
        innervation: 'N/A'
      },
      {
        id: 'scapula-medial-border',
        name: 'Scapula Medial Border',
        abbrev: 'SMB',
        group: 'Skeletal Landmarks',
        desc: 'The long edge of the scapula facing the vertebral column.',
        origin: 'Scapular boundary.',
        insertion: 'Insertion for serratus anterior, levator scapulae, and rhomboids.',
        action: 'Acts as lever edge for scapular rotation and retraction.',
        innervation: 'N/A'
      },
      {
        id: 'sternahyoid',
        name: 'Sternohyoid',
        abbrev: 'St',
        group: 'Head & Neck',
        desc: 'A thin infrahyoid muscle depressing the hyoid bone.',
        origin: 'Posterior surface of manubrium and medial clavicle.',
        insertion: 'Lower border of body of hyoid bone.',
        action: 'Depresses hyoid bone after elevation.',
        innervation: 'Ansa cervicalis (cervical plexus C1-C3).'
      },
      {
        id: 'sternocleidomastoid',
        name: 'Sternocleidomastoid',
        abbrev: 'Ste',
        group: 'Head & Neck',
        desc: 'The prominent neck muscle flexing the cervical spine and rotating the head.',
        origin: 'Sternal head (manubrium) and clavicular head (medial clavicle).',
        insertion: 'Mastoid process and superior nuchal line.',
        action: 'Flexes neck (bilateral); rotates head to opposite side (unilateral).',
        innervation: 'Accessory nerve (CN XI) and C2-C3 branches.'
      },
      {
        id: 'sternum',
        name: 'Sternum',
        abbrev: 'Ster',
        group: 'Skeletal Landmarks',
        desc: 'The breastbone, flat bone at the center of the chest.',
        origin: 'Thoracic skeletal midline.',
        insertion: 'Articulates with clavicles and ribs 1-7.',
        action: 'Protects thoracic cavity contents; muscle attachment plate.',
        innervation: 'N/A'
      },
      {
        id: 'stylohyoid',
        name: 'Stylohyoid',
        abbrev: 'Sty',
        group: 'Head & Neck',
        desc: 'A slender suprahyoid muscle pulling the hyoid upward and back.',
        origin: 'Posterior border of styloid process of temporal bone.',
        insertion: 'Body of hyoid bone.',
        action: 'Elevates and retracts hyoid bone during swallowing.',
        innervation: 'Facial nerve stylohyoid branch (CN VII).'
      },
      {
        id: 'triceps',
        name: 'Triceps',
        abbrev: 'T',
        group: 'Upper Limb',
        desc: 'A large, three-headed muscle on the back of the upper arm.',
        origin: 'Long head (scapula), lateral and medial heads (posterior humerus).',
        insertion: 'Olecranon process of ulna.',
        action: 'Extends forearm at elbow joint.',
        innervation: 'Radial nerve (C6-C8).'
      },
      {
        id: 'tibialis-anterior',
        name: 'Tibialis Anterior',
        abbrev: 'TA',
        group: 'Lower Body',
        desc: 'A key muscle of the anterior shin, dorsiflexing and inverting the foot.',
        origin: 'Lateral condyle and proximal shaft of tibia.',
        insertion: 'Medial cuneiform and base of metatarsal 1.',
        action: 'Dorsiflexion and inversion of foot.',
        innervation: 'Deep fibular nerve (L4, L5).'
      },
      {
        id: 'thenar-eminence',
        name: 'Thenar Eminence',
        abbrev: 'TE',
        group: 'Upper Limb',
        desc: 'The fleshy mass on the lateral palm at the base of the thumb.',
        origin: 'Carpal bones and flexor retinaculum.',
        insertion: 'Thumb proximal phalanx and metacarpal bases.',
        action: 'Muscular group controlling thumb abduction, flexion, and opposition.',
        innervation: 'Median nerve (and deep ulnar nerve).'
      },
      {
        id: 'temporalis',
        name: 'Temporalis',
        abbrev: 'Tem',
        group: 'Head & Neck',
        desc: 'A fan-shaped chewing muscle on the side of the skull.',
        origin: 'Temporal fossa of temporal bone.',
        insertion: 'Coronoid process and anterior ramus of mandible.',
        action: 'Elevates and retracts mandible (closes jaw).',
        innervation: 'Deep temporal nerves (trigeminal mandibular V3).'
      },
      {
        id: 'tensor-fasciae-latae',
        name: 'Tensor Fasciae Latae',
        abbrev: 'TFL',
        group: 'Lower Body',
        desc: 'A hip muscle that tenses the fascia lata (IT band) to stabilize the leg.',
        origin: 'Anterior part of outer lip of iliac crest and ASIS.',
        insertion: 'Iliotibial tract (IT band).',
        action: 'Abducts, flexes, and medially rotates hip; stabilizes knee.',
        innervation: 'Superior gluteal nerve (L4, L5, S1).'
      },
      {
        id: 'thyrohyoid',
        name: 'Thyrohyoid',
        abbrev: 'Th',
        group: 'Head & Neck',
        desc: 'A small infrahyoid muscle in the neck elevating the larynx.',
        origin: 'Oblique line of thyroid cartilage.',
        insertion: 'Lower border of body and greater horn of hyoid bone.',
        action: 'Depresses hyoid bone or elevates thyroid cartilage/larynx.',
        innervation: 'C1 fibers via hypoglossal nerve (CN XII).'
      },
      {
        id: 'tibia',
        name: 'Tibia',
        abbrev: 'Ti',
        group: 'Skeletal Landmarks',
        desc: 'The shinbone, which is the larger and stronger of the two leg bones.',
        origin: 'Lower leg skeletal core.',
        insertion: 'Articulates with femur, fibula, and talus.',
        action: 'Bears body weight; muscle insertion structures.',
        innervation: 'N/A'
      },
      {
        id: 'teres-major',
        name: 'Teres Major',
        abbrev: 'TMa',
        group: 'Upper Limb',
        desc: 'A thick muscle in shoulder-scapular area assisting latissimus dorsi.',
        origin: 'Posterior surface of inferior angle of scapula.',
        insertion: 'Medial lip of intertubercular groove of humerus.',
        action: 'Adducts, extends, and medially rotates arm.',
        innervation: 'Lower subscapular nerve (C5, C6).'
      },
      {
        id: 'teres-minor',
        name: 'Teres Minor',
        abbrev: 'TMi',
        group: 'Upper Limb',
        desc: 'A narrow rotator cuff muscle laterally rotating the shoulder.',
        origin: 'Upper two-thirds of lateral border of scapula.',
        insertion: 'Greater tubercle of humerus (inferior facet).',
        action: 'Laterally rotates arm and stabilizes shoulder joint.',
        innervation: 'Axillary nerve (C5, C6).'
      },
      {
        id: 'triceps-tendon',
        name: 'Triceps Tendon',
        abbrev: 'TT',
        group: 'Connective Tissue',
        desc: 'The tough fibrous tendon connecting triceps heads to the elbow bony tip.',
        origin: 'Triceps muscle belly.',
        insertion: 'Superior surface of olecranon process of ulna.',
        action: 'Transmits forces from triceps to extend the elbow joint.',
        innervation: 'N/A'
      },
      {
        id: 'trapezius',
        name: 'Trapezius',
        abbrev: 'Tr',
        group: 'Core & Trunk',
        desc: 'The large flat triangular back/neck muscle stabilizing the shoulders.',
        origin: 'Occipital bone, ligamentum nuchae, and spinous processes of C7-T12.',
        insertion: 'Clavicle, acromion, and spine of scapula.',
        action: 'Elevates, retracts, and rotates scapula.',
        innervation: 'Accessory nerve (CN XI).'
      },
      {
        id: 'ulna',
        name: 'Ulna',
        abbrev: 'U',
        group: 'Skeletal Landmarks',
        desc: 'The medial bone of the forearm, forming the elbow articulation.',
        origin: 'Forearm skeletal structure.',
        insertion: 'Articulates with humerus and radius.',
        action: 'Acts as skeletal base for elbow hinges and wrist support.',
        innervation: 'N/A'
      },
      {
        id: 'vastus-lateralis',
        name: 'Vastus Lateralis',
        abbrev: 'VL',
        group: 'Lower Body',
        desc: 'The largest lateral segment of the quadriceps femoris group.',
        origin: 'Greater trochanter and lateral lip of linea aspera of femur.',
        insertion: 'Patella and tibial tuberosity via patellar ligament.',
        action: 'Extends knee joint.',
        innervation: 'Femoral nerve (L2-L4).'
      },
      {
        id: 'vastus-medialis',
        name: 'Vastus Medialis',
        abbrev: 'VM',
        group: 'Lower Body',
        desc: 'The teardrop-shaped medial portion of the quadriceps femoris.',
        origin: 'Linea aspera and spiral line of femur.',
        insertion: 'Patella and tibial tuberosity via patellar ligament.',
        action: 'Extends knee joint; stabilizes patella.',
        innervation: 'Femoral nerve (L2-L4).'
      },
      {
        id: 'zygomaticus-minor',
        name: 'Zygomaticus Minor',
        abbrev: 'ZM',
        group: 'Head & Neck',
        desc: 'A small facial muscle elevating the upper lip to smile.',
        origin: 'Lateral surface of zygomatic bone.',
        insertion: 'Skin of upper lip, medial to angle of mouth.',
        action: 'Elevates upper lip (expresses sadness or smiling).',
        innervation: 'Zygomatic/buccal branches of facial nerve (CN VII).'
      },
      {
        id: 'zygomaticus-major',
        name: 'Zygomaticus Major',
        abbrev: 'ZMa',
        group: 'Head & Neck',
        desc: 'A facial muscle drawing the angle of the mouth up and back (laughing/smiling).',
        origin: 'Lateral surface of zygomatic bone.',
        insertion: 'Skin and muscle at angle of mouth (modiolus).',
        action: 'Pulls angle of mouth upward and backward (smile).',
        innervation: 'Zygomatic/buccal branches of facial nerve (CN VII).'
      }
    ];

    // Quiz Questions Pool (10 Biology Questions)
    this.quizQuestions = [
      {
        type: 'single',
        category: 'core',
        question: 'Which specific connective tissue membrane surrounds an entire skeletal muscle as an organ?<br><small style="color: var(--text-muted);">(key point : wraps the entire muscle organ)</small>',
        choices: ['Epimysium', 'Endomysium', 'Perimysium'],
        answer: 0
      },
      {
        type: 'boolean',
        category: 'upper',
        question: 'Masseter muscle is the strongest muscle located on the jaw which can exert force up to 1000 N (~100kg). True or False?',
        choices: ['True', 'False'],
        answer: 0
      },
      {
        type: 'single',
        category: 'core',
        question: 'During the process of muscle contraction, what role does ATP play when it binds to a myosin head?<br><small style="color: var(--text-muted);">(Clue : drive the cross-bridge cycle)</small>',
        choices: [
          'It converts chemical energy to mechanical energy via the catalytic site to power movement.',
          'It directly binds to Troponin to trigger a conformational shift.',
          'It act as a physical block on actin to prevent cross bridge formation.'
        ],
        answer: 0
      },
      {
        type: 'single',
        category: 'core',
        question: 'Which muscular property allows a muscle to return to its original shape after being stretched?',
        choices: ['Extensibility', 'Elasticity', 'Excitability'],
        answer: 1
      },
      {
        type: 'single',
        category: 'upper',
        question: 'What does the term "Electromyogram" refer to?',
        choices: [
          'The machine used to record muscle signals',
          'The actual graph or record obtained from the test',
          'The needle inserted into the muscle'
        ],
        answer: 1
      },
      {
        type: 'single',
        category: 'core',
        question: 'Which type of muscle is under our conscious (voluntary) control?',
        choices: ['Cardiac muscle', 'Skeletal muscle', 'Smooth muscle'],
        answer: 1
      },
      {
        type: 'boolean',
        category: 'core',
        question: 'One of the function of muscular tissues is thermogenesis. True of False?',
        choices: ['True', 'False'],
        answer: 0
      },
      {
        type: 'single',
        category: 'lower',
        question: 'The location of smooth muscle?',
        choices: [
          'The heart',
          'Attached to bones',
          'Wall of hollow organs, vessel, respiratory passageways'
        ],
        answer: 2
      },
      {
        type: 'multiple',
        category: 'core',
        question: 'Two types of regulatory proteins?',
        choices: ['Troponin', 'Trophobic', 'Tropophilic', 'Tropomyosin'],
        answer: [0, 3]
      },
      {
        type: 'multiple',
        category: 'lower',
        question: 'Types of muscle fibers? (more than one answer)',
        choices: ['Red muscle', 'Mixed muscle', 'White muscle', 'Yellow muscle'],
        answer: [0, 2]
      }
    ];
  }

  /**
   * Initialize Application
   */
  init() {
    this.applyTheme();
    this.setupEventListeners();
    this.renderMuscleDatabase();

    // Set landing active state in hash/URL
    window.location.hash = this.state.activeTab;

    // Refresh icons
    lucide.createIcons();
  }

  /**
   * Theme Manager
   */
  applyTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    if (this.state.theme === 'light') {
      body.classList.add('light-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
      }
    } else {
      body.classList.remove('light-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
      }
    }
    lucide.createIcons();
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.state.theme);
    this.applyTheme();
  }

  /**
   * Event Listeners & Router Setup
   */
  setupEventListeners() {
    // Navigation Tabs Router
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Search fields
    const muscleSearch = document.getElementById('muscle-search-input');
    if (muscleSearch) {
      muscleSearch.addEventListener('input', (e) => this.filterMuscleList(e.target.value));
    }
  }

  /**
   * Router View Switching
   */
  switchTab(tabId) {
    // Prevent leaving quiz in progress without warning
    if (this.state.quizActive && tabId !== 'anatomy-quiz') {
      const confirmLeave = confirm("You have an active assessment in progress. Leaving will discard your answers. Proceed?");
      if (!confirmLeave) return;
      this.stopQuizTimer();
      this.state.quizActive = false;
    }

    this.state.activeTab = tabId;

    // Update Nav Link Classes
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update View Panes Classes
    document.querySelectorAll('.view-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(tabId);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    // Update hash for accessibility
    window.location.hash = tabId;
  }

  /**
   * 3D Muscle Explorer & Database Functions
   */
  renderMuscleDatabase() {
    const listEl = document.getElementById('muscle-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    this.muscleDb.forEach((muscle, idx) => {
      const card = document.createElement('div');
      card.className = 'muscle-item-card';
      card.id = `muscle-card-${muscle.id}`;
      card.dataset.id = muscle.id;

      card.innerHTML = `
        <div class="muscle-item-header">
          <span class="muscle-item-name">${muscle.name} (${muscle.abbrev})</span>
          <span class="muscle-item-group">${muscle.group}</span>
        </div>
        <p class="muscle-item-desc">${muscle.desc}</p>
        <div class="muscle-item-details-drawer hidden" id="drawer-${muscle.id}">
          <div class="detail-row"><span class="detail-title">Origin:</span><span class="detail-content">${muscle.origin}</span></div>
          <div class="detail-row"><span class="detail-title">Insertion:</span><span class="detail-content">${muscle.insertion}</span></div>
          <div class="detail-row"><span class="detail-title">Primary Action:</span><span class="detail-content">${muscle.action}</span></div>
          <div class="detail-row"><span class="detail-title">Innervation:</span><span class="detail-content">${muscle.innervation}</span></div>
        </div>
      `;

      card.addEventListener('click', () => this.toggleMuscleCard(muscle.id));
      listEl.appendChild(card);
    });

    lucide.createIcons();
  }

  toggleMuscleCard(muscleId) {
    const card = document.getElementById(`muscle-card-${muscleId}`);
    const drawer = document.getElementById(`drawer-${muscleId}`);

    if (!card || !drawer) return;

    const isExpanded = card.classList.contains('expanded');

    // Close other expanded cards
    document.querySelectorAll('.muscle-item-card.expanded').forEach(c => {
      c.classList.remove('expanded');
      const d = c.querySelector('.muscle-item-details-drawer');
      if (d) d.classList.add('hidden');
    });

    // Toggle active card
    if (!isExpanded) {
      card.classList.add('expanded');
      drawer.classList.remove('hidden');
      lucide.createIcons();
    }
  }

  filterMuscleList(query) {
    const term = query.toLowerCase();
    this.muscleDb.forEach(muscle => {
      const card = document.getElementById(`muscle-card-${muscle.id}`);
      if (card) {
        const matches = muscle.name.toLowerCase().includes(term) ||
          (muscle.abbrev && muscle.abbrev.toLowerCase().includes(term)) ||
          muscle.group.toLowerCase().includes(term) ||
          muscle.desc.toLowerCase().includes(term);
        if (matches) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  }

  /**
   * Quiz Assessment System
   */
  startQuiz() {
    this.state.quizActive = true;
    this.state.quizTimer = 0;
    this.state.currentQuestionIndex = 0;
    this.state.selectedAnswers = Array(10).fill(null);

    const startScreen = document.getElementById('quiz-start-screen');
    const activeScreen = document.getElementById('quiz-active-screen');
    const resultsScreen = document.getElementById('quiz-results-screen');

    if (startScreen) startScreen.classList.add('hidden');
    if (activeScreen) activeScreen.classList.remove('hidden');
    if (resultsScreen) resultsScreen.classList.add('hidden');

    this.renderQuizQuestion();
    this.startQuizTimer();
  }

  startQuizTimer() {
    const timerEl = document.getElementById('quiz-timer');
    this.state.quizTimerInterval = setInterval(() => {
      this.state.quizTimer++;
      if (timerEl) timerEl.textContent = this.formatTime(this.state.quizTimer);
    }, 1000);
  }

  stopQuizTimer() {
    if (this.state.quizTimerInterval) {
      clearInterval(this.state.quizTimerInterval);
    }
  }

  formatTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  }

  renderQuizQuestion() {
    const container = document.getElementById('quiz-question-box');
    const progressText = document.getElementById('quiz-progress-text');
    const progressFill = document.getElementById('quiz-progress-fill');

    if (!container) return;

    const qIdx = this.state.currentQuestionIndex;
    const q = this.quizQuestions[qIdx];

    // Update progress bar
    if (progressText) progressText.textContent = `Question ${qIdx + 1} of 10`;
    if (progressFill) progressFill.style.width = `${((qIdx + 1) / 10) * 100}%`;

    // Render Question Text and choices
    let choicesHtml = '';
    q.choices.forEach((choice, cIdx) => {
      let isSelected = false;
      if (q.type === 'multiple') {
        isSelected = Array.isArray(this.state.selectedAnswers[qIdx]) &&
          this.state.selectedAnswers[qIdx].includes(cIdx);
      } else {
        isSelected = this.state.selectedAnswers[qIdx] === cIdx;
      }

      choicesHtml += `
        <div class="quiz-choice-opt ${isSelected ? 'selected' : ''}" onclick="app.selectQuizAnswer(${cIdx})">
          <div class="quiz-choice-bullet ${q.type === 'multiple' ? 'checkbox-bullet' : ''}">
            ${q.type === 'multiple' ? (isSelected ? '✓' : '') : String.fromCharCode(65 + cIdx)}
          </div>
          <span>${choice}</span>
        </div>
      `;
    });

    container.innerHTML = `
      <h3 class="quiz-question-text">${q.question}</h3>
      <div class="quiz-choices">
        ${choicesHtml}
      </div>
    `;

    // Toggle footer buttons
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const submitBtn = document.getElementById('quiz-submit-btn');

    if (qIdx === 0) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }

    if (qIdx === 9) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }

  selectQuizAnswer(choiceIndex) {
    const qIdx = this.state.currentQuestionIndex;
    const q = this.quizQuestions[qIdx];

    if (q.type === 'multiple') {
      if (!Array.isArray(this.state.selectedAnswers[qIdx])) {
        this.state.selectedAnswers[qIdx] = [];
      }
      const index = this.state.selectedAnswers[qIdx].indexOf(choiceIndex);
      if (index > -1) {
        this.state.selectedAnswers[qIdx].splice(index, 1);
      } else {
        this.state.selectedAnswers[qIdx].push(choiceIndex);
      }
    } else {
      this.state.selectedAnswers[qIdx] = choiceIndex;
    }

    // Re-render to show selection
    this.renderQuizQuestion();
  }

  nextQuizQuestion() {
    if (this.state.currentQuestionIndex < 9) {
      this.state.currentQuestionIndex++;
      this.renderQuizQuestion();
    }
  }

  prevQuizQuestion() {
    if (this.state.currentQuestionIndex > 0) {
      this.state.currentQuestionIndex--;
      this.renderQuizQuestion();
    }
  }

  submitQuizPrompt() {
    // Check if all questions are answered
    const unanswered = [];
    this.state.selectedAnswers.forEach((ans, idx) => {
      if (ans === null || (Array.isArray(ans) && ans.length === 0)) unanswered.push(idx + 1);
    });

    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting. Unanswered: Question ${unanswered.join(', ')}`);
      return;
    }

    // Grade and Complete Quiz
    this.stopQuizTimer();
    this.state.quizActive = false;

    let correctCount = 0;
    this.quizQuestions.forEach((q, idx) => {
      const selected = this.state.selectedAnswers[idx];
      let isCorrect = false;

      if (q.type === 'multiple') {
        if (Array.isArray(selected) && Array.isArray(q.answer)) {
          isCorrect = selected.length === q.answer.length &&
            selected.every(val => q.answer.includes(val));
        }
      } else {
        isCorrect = selected === q.answer;
      }

      if (isCorrect) {
        correctCount++;
      }
    });

    const finalPct = Math.round((correctCount / 10) * 100);
    const timeString = this.formatTime(this.state.quizTimer);

    // Show Results Screen
    const activeScreen = document.getElementById('quiz-active-screen');
    const resultsScreen = document.getElementById('quiz-results-screen');
    if (activeScreen) activeScreen.classList.add('hidden');
    if (resultsScreen) resultsScreen.classList.remove('hidden');

    // Display Results
    document.getElementById('results-score-ratio').textContent = `${correctCount} / 10`;
    document.getElementById('results-score-pct').textContent = `${finalPct}%`;
    document.getElementById('results-time-taken').textContent = timeString;
  }

  resetQuizToStart() {
    this.state.quizActive = false;
    this.state.quizTimer = 0;
    this.state.currentQuestionIndex = 0;
    this.state.selectedAnswers = Array(10).fill(null);

    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) timerEl.textContent = '00:00';

    const startScreen = document.getElementById('quiz-start-screen');
    const activeScreen = document.getElementById('quiz-active-screen');
    const resultsScreen = document.getElementById('quiz-results-screen');

    if (startScreen) startScreen.classList.remove('hidden');
    if (activeScreen) activeScreen.classList.add('hidden');
    if (resultsScreen) resultsScreen.classList.add('hidden');
  }
}

// Instantiate and Run application
const app = new AnatomyApp();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
