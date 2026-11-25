/**
 * CONFIGURACIÓN MAESTRA CENTRALIZADA DEL EVENTO — MONTSE & GERARDO (2027)
 *
 * Única fuente editable de recintos, horarios, itinerario, dress code,
 * hospedaje segmentado, mesa de regalos, datos bancarios y contacto.
 * Sustituir los valores marcados con // [POR CONFIRMAR] antes de la emisión final.
 */

export interface VenueDetail {
  readonly id: string;
  readonly tag: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly timeLabel: string;
  readonly venueName: string;
  readonly address: string;
  readonly mapsUrl: string;
  readonly note?: string;
}

export interface ItineraryMilestone {
  readonly id: string;
  readonly time: string;
  readonly title: string;
  readonly description: string;
  readonly locationHint?: string;
}

export interface DressCodeSwatch {
  readonly name: string;
  readonly swatchClass: string;
}

export interface DressCodeInfo {
  readonly badgeLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly womenGuidance: string;
  readonly menGuidance: string;
  readonly reservedColorNote: string;
  readonly suggestedPalette: readonly DressCodeSwatch[];
}

export interface HostHotelDetail {
  readonly badgeLabel: string;
  readonly name: string;
  readonly address: string;
  readonly rateNote: string;
  readonly groupCode: string;
  readonly bookingUrl: string;
  readonly stayNote: string;
}

export interface PartnerHotelDetail {
  readonly id: string;
  readonly name: string;
  readonly areaAndDistance: string;
  readonly rateNote: string;
  readonly promoCode: string;
  readonly bookingUrl: string;
}

export interface GiftRegistryItem {
  readonly id: string;
  readonly storeName: string;
  readonly subtitle: string;
  readonly eventNumber?: string;
  readonly url: string;
}

export interface BankTransferDetails {
  readonly banco: string;
  readonly beneficiario: string;
  readonly cuenta: string;
  readonly clabe: string;
  readonly clabeFormatted: string;
  readonly referenceNote: string;
}

export interface EventDetailsConfig {
  readonly coupleNames: string;
  readonly weddingYear: string;
  readonly venues: {
    readonly fridayCivil: VenueDetail;
    readonly saturdayCeremony: VenueDetail;
    readonly saturdayReception: VenueDetail;
  };
  readonly itinerary: {
    readonly friday: {
      readonly heading: string;
      readonly dateLabel: string;
      readonly items: readonly ItineraryMilestone[];
    };
    readonly saturday: {
      readonly heading: string;
      readonly dateLabel: string;
      readonly items: readonly ItineraryMilestone[];
    };
  };
  readonly dressCode: DressCodeInfo;
  readonly lodging: {
    readonly tierAHostHotel: HostHotelDetail;
    readonly tierBPartnerHotels: readonly PartnerHotelDetail[];
  };
  readonly gifts: {
    readonly introNote: string;
    readonly registries: readonly GiftRegistryItem[];
    readonly bankTransfer: BankTransferDetails;
  };
  readonly whatsapp: {
    readonly contactPhone: string;
  };
}

export const EVENT_DETAILS: EventDetailsConfig = {
  coupleNames: 'Montse & Gerardo',
  weddingYear: '2027',
  venues: {
    // [POR CONFIRMAR] Datos de Ceremonia Civil y Brindis (Exclusivo Tier A)
    fridayCivil: {
      id: 'civil-viernes',
      tag: 'Viernes · Evento Íntimo',
      title: 'Ceremonia Civil y Brindis',
      dateLabel: 'Viernes 16 de Julio, 2027',
      timeLabel: '18:00 hrs',
      venueName: 'Terraza del Jardín Privado, Hotel Sede', // [POR CONFIRMAR]
      address: 'Av. Paseo de la Reforma 1200, Col. Lomas de Chapultepec, CDMX', // [POR CONFIRMAR]
      mapsUrl: 'https://maps.google.com/?q=Paseo+de+la+Reforma+CDMX', // [POR CONFIRMAR]
      note: 'Recepción íntima y brindis de bienvenida al atardecer.',
    },
    // [POR CONFIRMAR] Datos de Ceremonia Religiosa (Universal — Sábado 17)
    saturdayCeremony: {
      id: 'ceremonia-sabado',
      tag: 'Ceremonia Religiosa',
      title: 'Misa de Bodas',
      dateLabel: 'Sábado 17 de Julio, 2027',
      timeLabel: '16:30 hrs', // [POR CONFIRMAR]
      venueName: 'Parroquia de Nuestra Señora del Pilar', // [POR CONFIRMAR]
      address: 'Calle de la Paz 45, Col. San Ángel, Ciudad de México', // [POR CONFIRMAR]
      mapsUrl: 'https://maps.google.com/?q=San+Angel+Ciudad+de+Mexico', // [POR CONFIRMAR]
      note: 'Agradecemos llegar 20 minutos antes para el inicio puntual de la ceremonia.',
    },
    // [POR CONFIRMAR] Datos de Recepción (Universal — Sábado 17)
    saturdayReception: {
      id: 'recepcion-sabado',
      tag: 'Recepción y Banquete',
      title: 'Celebración',
      dateLabel: 'Sábado 17 de Julio, 2027',
      timeLabel: '18:30 hrs', // [POR CONFIRMAR]
      venueName: 'Hacienda de los Morales · Jardín Principal', // [POR CONFIRMAR]
      address: 'Juan Vázquez de Mella 525, Polanco, Ciudad de México', // [POR CONFIRMAR]
      mapsUrl: 'https://maps.google.com/?q=Hacienda+de+los+Morales+CDMX', // [POR CONFIRMAR]
      note: 'Cóctel de bienvenida seguido de cena, primer baile y celebración.',
    },
  },
  itinerary: {
    // [POR CONFIRMAR] Itinerario Viernes 16 (Exclusivo Tier A)
    friday: {
      heading: 'Viernes de Bienvenida',
      dateLabel: 'Viernes 16 de Julio, 2027',
      items: [
        {
          id: 'fri-1',
          time: '18:00',
          title: 'Recepción en Terraza',
          description:
            'Llegada de familia cercana y copa de bienvenida al atardecer.',
          locationHint: 'Terraza del Jardín Privado', // [POR CONFIRMAR]
        },
        {
          id: 'fri-2',
          time: '18:30',
          title: 'Ceremonia Civil',
          description:
            'Firma de acta civil y lectura de votos íntimos junto a nuestros seres queridos.',
        },
        {
          id: 'fri-3',
          time: '19:30',
          title: 'Brindis y Cena de Bienvenida',
          description:
            'Mesa compartida, música acústica y celebración previa al gran día.',
        },
      ],
    },
    // [POR CONFIRMAR] Itinerario Sábado 17 (Universal)
    saturday: {
      heading: 'Día de la Boda',
      dateLabel: 'Sábado 17 de Julio, 2027',
      items: [
        {
          id: 'sat-1',
          time: '16:30',
          title: 'Ceremonia Religiosa',
          description:
            'Celebración eucarística y bendición de nuestra unión.',
          locationHint: 'Parroquia de Nuestra Señora del Pilar', // [POR CONFIRMAR]
        },
        {
          id: 'sat-2',
          time: '18:30',
          title: 'Cóctel de Bienvenida',
          description:
            'Música en vivo, canapés artesanales y coctelería de autor en el jardín.',
          locationHint: 'Jardín Principal', // [POR CONFIRMAR]
        },
        {
          id: 'sat-3',
          time: '20:00',
          title: 'Banquete Editorial',
          description:
            'Cena de tres tiempos y brindis con nuestras familias y amigos.',
        },
        {
          id: 'sat-4',
          time: '21:45',
          title: 'Primer Baile',
          description:
            'Un instante especial en la pista antes de abrir la celebración.',
        },
        {
          id: 'sat-5',
          time: '22:15',
          title: 'Celebración',
          description:
            'Música, baile y brindis para celebrar hasta el amanecer.',
        },
      ],
    },
  },
  dressCode: {
    badgeLabel: 'Etiqueta Formal', // [POR CONFIRMAR]
    title: 'Código de Vestimenta',
    subtitle: 'Elegancia atemporal de noche', // [POR CONFIRMAR]
    womenGuidance:
      'Vestido largo de noche en telas fluidas o estructuradas. Sugerimos tacón cómodo o bloque para las áreas de jardín.', // [POR CONFIRMAR]
    menGuidance:
      'Traje formal oscuro o smoking clásico con corbata o moño de seda.', // [POR CONFIRMAR]
    reservedColorNote:
      'Con mucho cariño les pedimos reservar los tonos blanco, marfil y champagne exclusivamente para la novia.',
    suggestedPalette: [
      { name: 'Borgoña', swatchClass: 'bg-burgundy' },
      { name: 'Olivo', swatchClass: 'bg-olive' },
      { name: 'Salvia', swatchClass: 'bg-sage' },
      { name: 'Champagne', swatchClass: 'bg-cream-deep' },
      { name: 'Espresso', swatchClass: 'bg-espresso' },
    ],
  },
  lodging: {
    // [POR CONFIRMAR] Hotel Sede (Exclusivo Tier A)
    tierAHostHotel: {
      badgeLabel: 'Hotel Sede · Bloqueo Especial',
      name: 'Hotel Boutique Casa Reforma', // [POR CONFIRMAR]
      address: 'Av. Paseo de la Reforma 1200, Lomas de Chapultepec, CDMX', // [POR CONFIRMAR]
      rateNote:
        'Tarifa preferencial de fin de semana garantizada reservando antes del 15 de Mayo de 2027.', // [POR CONFIRMAR]
      groupCode: 'MG2027SEDE', // [POR CONFIRMAR]
      bookingUrl: 'https://www.booking.com/?group=MG2027SEDE', // [POR CONFIRMAR]
      stayNote:
        'Escanea el código QR o utiliza el enlace directo para aplicar automáticamente la tarifa de grupo.',
    },
    // [POR CONFIRMAR] Hoteles Alternos con Convenio (Exclusivo Tier B)
    tierBPartnerHotels: [
      {
        id: 'partner-1',
        name: 'Hotel Presidente Polanco', // [POR CONFIRMAR]
        areaAndDistance: 'Polanco · A 6 min de la recepción', // [POR CONFIRMAR]
        rateNote: '18% de descuento en tarifa flexible con desayuno incluido.', // [POR CONFIRMAR]
        promoCode: 'BODAMG27', // [POR CONFIRMAR]
        bookingUrl: 'https://www.booking.com/?promo=BODAMG27', // [POR CONFIRMAR]
      },
      {
        id: 'partner-2',
        name: 'JW Suites Campos Elíseos', // [POR CONFIRMAR]
        areaAndDistance: 'Campos Elíseos · A 8 min de la recepción', // [POR CONFIRMAR]
        rateNote: 'Tarifa preferencial de convenio para invitados de la boda.', // [POR CONFIRMAR]
        promoCode: 'MONTSEYGERARDO', // [POR CONFIRMAR]
        bookingUrl: 'https://www.booking.com/?promo=MONTSEYGERARDO', // [POR CONFIRMAR]
      },
      {
        id: 'partner-3',
        name: 'Camino Real Jardines', // [POR CONFIRMAR]
        areaAndDistance: 'Anzures · A 10 min de la recepción', // [POR CONFIRMAR]
        rateNote: 'Convenio especial en habitaciones Deluxe y Junior Suite.', // [POR CONFIRMAR]
        promoCode: 'MGJULIO27', // [POR CONFIRMAR]
        bookingUrl: 'https://www.booking.com/?promo=MGJULIO27', // [POR CONFIRMAR]
      },
    ],
  },
  gifts: {
    introNote:
      'Su presencia es nuestro mejor regalo. Si desean acompañarnos con un detalle para nuestro nuevo hogar, hemos preparado estas opciones:',
    registries: [
      {
        id: 'liverpool',
        storeName: 'Liverpool',
        subtitle: 'Mesa de Regalos Digital',
        eventNumber: 'Evento #51202701', // [POR CONFIRMAR]
        url: 'https://mesaderegalos.liverpool.com.mx/', // [POR CONFIRMAR]
      },
      {
        id: 'palacio',
        storeName: 'El Palacio de Hierro',
        subtitle: 'Celebra con Nosotros',
        eventNumber: 'Evento #88202717', // [POR CONFIRMAR]
        url: 'https://www.elpalaciodehierro.com/celebra', // [POR CONFIRMAR]
      },
      {
        id: 'amazon',
        storeName: 'Amazon',
        subtitle: 'Lista de Bodas Seleccionada',
        eventNumber: 'Lista M & G 2027', // [POR CONFIRMAR]
        url: 'https://www.amazon.com.mx/wedding', // [POR CONFIRMAR]
      },
    ],
    // [POR CONFIRMAR] Datos Bancarios para Lluvia de Sobres
    bankTransfer: {
      banco: 'BBVA México', // [POR CONFIRMAR]
      beneficiario: 'Montserrat & Gerardo', // [POR CONFIRMAR]
      cuenta: '0123 4567 89', // [POR CONFIRMAR]
      clabe: '012180001234567890', // [POR CONFIRMAR] — 18 dígitos
      clabeFormatted: '012 180 0012 3456 7890', // [POR CONFIRMAR]
      referenceNote: 'Concepto sugerido: Regalo de boda + tu nombre.',
    },
  },
  whatsapp: {
    contactPhone: '5215500000000', // [POR CONFIRMAR] Formato internacional sin '+'
  },
};
