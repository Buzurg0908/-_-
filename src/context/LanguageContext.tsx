import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en' | 'am' | 'cn';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  nav_home: { ru: 'Главная', en: 'Home', am: 'Գլխավոր', cn: '首页' },
  nav_orders: { ru: 'Заказы', en: 'Orders', am: 'Պատվերներ', cn: '订单' },
  nav_marketplace: { ru: 'Маркетплейс', en: 'Marketplace', am: 'Շուկա', cn: '市场' },
  nav_support: { ru: 'Поддержка', en: 'Support', am: 'Աջակցություն', cn: '支持' },
  nav_dashboard: { ru: 'Панель', en: 'Dashboard', am: 'Վահանակ', cn: '仪表板' },
  nav_chat: { ru: 'Чат', en: 'Chat', am: 'Չատ', cn: '聊天' },
  nav_payments: { ru: 'Платежи', en: 'Payments', am: 'Վճարումներ', cn: '支付' },
  nav_reviews: { ru: 'Отзывы', en: 'Reviews', am: 'Կարծիքներ', cn: '评论' },
  nav_settings: { ru: 'Настройки', en: 'Settings', am: 'Կարգավորումներ', cn: '设置' },
  nav_analytics: { ru: 'Аналитика', en: 'Analytics', am: 'Անալիտիկա', cn: '分析' },
  nav_create_order: { ru: 'Создать заказ', en: 'Create Order', am: 'Ստեղծել պատվեր', cn: '创建订单' },
  
  // Hero
  hero_tag: { ru: 'ПРОТОКОЛ АКТИВИРОВАН', en: 'PROTOCOL ACTIVATED', am: 'ԱՐՁԱՆԱԳՐՈՒԹՅՈՒՆԸ ԱԿՏԻՎԱՑՎԱԾ Է', cn: '协议已激活' },
hero_title_1: { ru: 'Современный', en: 'Modern', am: 'ԺԱՄԱՆԱԿԱԿԻՑ', cn: '现代' },
  hero_title_2: { ru: 'ФРИЛАНС', en: 'FREELANCE', am: 'ՖՐԻԼԱՆՍ', cn: '自由职业' },
  hero_subtitle: { ru: 'Соединяем таланты мирового уровня и инновационные компании в безопасной экосистеме.', en: 'Connect with world-class talent and innovative companies in a highly secure freelance marketplace.', am: 'Միացեք համաշխարհային կարգի տաղանդների և նորարարական ընկերությունների հետ անվտանգ էկոհամակարգում:', cn: '在高度安全的自由职业市场中与世界级人才和创新公司建立联系。' },
  btn_find_talent: { ru: 'Найти талант', en: 'Find Talent', am: 'Գտնել տաղանդ', cn: '寻找人才' },
  btn_be_freelancer: { ru: 'Стать фрилансером', en: 'Become Freelancer', am: 'Դառնալ ֆրիլանսեր', cn: '成为自由职业者' },
  home_trending: { ru: 'В ТРЕНДЕ', en: 'TRENDING', am: 'ԹՐԵՆԴԱՅԻՆ', cn: '趋势' },
  home_top_rated: { ru: 'ТОП РЕЙТИНГ', en: 'TOP RATED', am: 'ԲԱՐՁՐ ՎԱՐԿԱՆԻՇ', cn: '高评分' },
  
  // Stats
  stat_experts: { ru: 'Верифицированные эксперты', en: 'Verified Experts', am: 'Ստուգված փորձագետներ', cn: '经过验证的专家' },
  stat_contracts: { ru: 'Сотни успешных контрактов', en: 'Successful Contracts', am: 'Հաջողված պայմանագրեր', cn: '成功的合同' },
  stat_rating: { ru: 'Средний рейтинг', en: 'Average Rating', am: 'Միջին վարկանիշ', cn: '平均评分' },
  stat_secure: { ru: 'Защищенные сделки', en: 'Secure Transactions', am: 'Ապահով գործարքներ', cn: '安全交易' },

  // Features
  feature_security_title: { ru: 'ПРОТОКОЛ БЕЗОПАСНОСТИ', en: 'SECURITY PROTOCOL', am: 'ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԱՐՁԱՆԱԳՐՈՒԹՅՈՒՆ', cn: '安全协议' },
  feature_security_desc: { ru: 'Мы переосмыслили фриланс, внедрив технологии будущего уже сегодня.', en: 'We reimagined freelance by implementing future technologies today.', am: 'Մենք վերաիմաստավորել ենք ֆրիլանսը՝ այսօր ներդնելով ապագայի տեխնոլոգիաները:', cn: '我们通过今天实施未来的技术重新构想了自由职业者。' },
  feature_1_title: { ru: 'Защищенные контракты', en: 'Secure Contracts', am: 'Ապահով պայմանագրեր', cn: '安全合同' },
  feature_1_desc: { ru: 'Каждая транзакция поддерживается нашей системой безопасного эскроу.', en: 'Every transaction is backed by our secure escrow system.', am: 'Յուրաքանչյուր գործարք ապահովված է մեր էսքրոու համակարգով:', cn: '每笔交易都由我们的安全托管理系统提供支持。' },
  feature_2_title: { ru: 'Элитная верификация', en: 'Elite Verification', am: 'Էլիտար ստուգում', cn: '精英验证' },
  feature_2_desc: { ru: 'Только 3% лучших талантов мира проходят наше тестирование.', en: 'Only the top 3% of world talent pass our testing.', am: 'Այս տաղանդների միայն լավագույն 3%-ն է անցնում մեր թեստավորումը:', cn: '全球只有前 3% 的人才通过了我们的认知测试。' },
  feature_3_title: { ru: 'Детектор фрода', en: 'Fraud Detector', am: 'Խարդախության դետեկտոր', cn: '欺诈检测器' },
  feature_3_desc: { ru: 'Система безопасности сканирует каждое сообщение и контракт для вашей защиты.', en: 'Security system scans every message and contract for your protection.', am: 'Անվտանգության համակարգը սկանավորում է յուրաքանչյուր հաղորդագրություն ձեր պաշտպանության համար:', cn: '安全系统会扫描每条消息和合同以保护您的安全。' },
  feature_4_title: { ru: 'Мгновенные выплаты', en: 'Instant Payouts', am: 'Ակնթարթային վճարումներ', cn: '即时付款' },
  feature_4_desc: { ru: 'Получайте оплату сразу после завершения вехи через карты или крипто-кошельки.', en: 'Get paid immediately after milestone completion via cards or crypto.', am: 'Ստացեք վճարումը անմիջապես փուլի ավարտից հետո:', cn: '里程碑完成后通过卡或加密货币立即获得付款。' },
  
  // Community
  community_title: { ru: 'ГЛОБАЛЬНОЕ СООБЩЕСТВО', en: 'GLOBAL COMMUNITY', am: 'ՀԱՄԱՇԽԱՐՀԱՅԻՆ ՀԱՄԱՅՆՔ', cn: '全球社群' },
  community_desc: { ru: 'Присоединяйтесь к тысячам профессионалов и визионеров.', en: 'Join thousands of professionals and visionaries building the future.', am: 'Միացեք հազարավոր պրոֆեսիոնալների և տեսլականների:', cn: '加入成千上万建设未来的专业人士和愿景家。' },
  community_btn: { ru: 'Вступить в Альянс', en: 'Join the Alliance', am: 'Միանալ դաշինքին', cn: '加入联盟' },

  // Marketplace
  market_title: { ru: 'МАРКЕТПЛЕЙС', en: 'MARKETPLACE', am: 'ՇՈՒԿԱ', cn: '市场' },
  market_subtitle: { ru: 'Открывайте элитные возможности и развивайте свой бизнес.', en: 'Discover elite opportunities and grow your business.', am: 'Բացահայտեք էլիտար հնարավորություններ:', cn: '发现精英机会并发展您的业务。' },
  market_search_placeholder: { ru: 'Поиск по ключевым словам, технологиям...', en: 'Search by keywords, technologies...', am: 'Փնտրել ըստ բանալի բառերի...', cn: '搜索关键词、技术...' },
  market_filters: { ru: 'Фильтры', en: 'Filters', am: 'Զտիչներ', cn: '过滤器' },
  market_create: { ru: 'Создать', en: 'Create', am: 'Ստեղծել', cn: '创建' },
  market_urgent: { ru: 'Срочно', en: 'Urgent', am: 'Շտապ', cn: '紧急' },
  market_budget: { ru: 'Бюджет', en: 'Budget', am: 'Բյուջե', cn: '预算' },
  market_deadline: { ru: 'Срок', en: 'Deadline', am: 'Վերջնաժամկետ', cn: '截止日期' },
  market_proposals: { ru: 'Отклики', en: 'Proposals', am: 'Առաջարկներ', cn: '提案' },
  market_view_order: { ru: 'Смотреть заказы', en: 'View Orders', am: 'Դիտել պատվերները', cn: '查看订单' },
  market_ai_active: { ru: 'СИСТЕМА АКТИВНА', en: 'SYSTEM ACTIVE', am: 'ՀԱՄԱԿԱՐԳԸ ԱԿՏԻՎ Է', cn: '系统活跃' },
  market_specialist: { ru: 'Специалист', en: 'Specialist', am: 'Մասնագետ', cn: '专家' },
  market_elite_client: { ru: 'Элитный клиент', en: 'Elite Client', am: 'Էլիտար հաճախորդ', cn: '精英客户' },
  market_spent: { ru: 'потрачено', en: 'spent', am: 'ծախսված', cn: '已花费' },
  market_no_orders: { ru: 'Заказов не найдено', en: 'No orders found', am: 'Պատվերներ չեն գտնվել', cn: '未找到订单' },

  // Auth
  auth_login_title: { ru: 'ВХОД В CORE', en: 'LOGIN TO CORE', am: 'ՄՈՒՏՔ CORE', cn: '登录核心' },
  auth_register_title: { ru: 'РЕГИСТРАЦИЯ CORE', en: 'REGISTER TO CORE', am: 'ԳՐԱՆՑՈՒՄ CORE', cn: '注册核心' },
  auth_subtitle: { ru: 'Ваш доступ к сети Neo-Lance.', en: 'Your access to the Neo-Lance network.', am: 'Ձեր մուտքը Neo-Lance ցանց:', cn: '您对 Neo-Lance 网络的访问权限。' },
  auth_email: { ru: 'Электронная почта', en: 'Email Address', am: 'Էլ. փոստ', cn: '电子邮件地址' },
  auth_password: { ru: 'Пароль', en: 'Password', am: 'Գաղտնաբառ', cn: '密码' },
  auth_forgot: { ru: 'Забыли?', en: 'Forgot?', am: 'Մոռացե՞լ եք:', cn: '忘记了？' },
  auth_btn_login: { ru: 'Инициализировать вход', en: 'Initialize Login', am: 'Նախաձեռնել մուտքը', cn: '初始化登录' },
  auth_btn_register: { ru: 'Создать аккаунт', en: 'Create Account', am: 'Ստեղծել հաշիվ', cn: '创建账户' },
  auth_or_continue: { ru: 'Или продолжить через', en: 'Or continue with', am: 'Կամ շարունակել', cn: '或者继续使用' },

  // Dashboard
  dash_welcome: { ru: 'С ВОЗВРАЩЕНИЕМ', en: 'WELCOME BACK', am: 'ԲԱՐԻ ԳԱԼՈՒՍՏ', cn: '欢迎回来' },
  dash_subtitle: { ru: 'Ваша панель управления оптимизирована.', en: 'Your dashboard is optimized.', am: 'Ձեր վահանակը օպտիմալացված է:', cn: '您的仪表板已优化。' },
  dash_total_revenue: { ru: 'Общий доход', en: 'Total Revenue', am: 'Ընդհանուր եկամուտ', cn: '总收入' },
  dash_active_projects: { ru: 'Активные проекты', en: 'Active Projects', am: 'Ակտիվ նախագծեր', cn: '进行中的项目' },
  dash_completed: { ru: 'Завершено', en: 'Completed', am: 'Ավարտված', cn: '已完成' },
  dash_avg_rating: { ru: 'Ср. рейтинг', en: 'Avg Rating', am: 'Միջին վարկանիշ', cn: '平均评分' },
  dash_growth_title: { ru: 'Финансовые показатели', en: 'Financial Performance', am: 'Ֆինանսական ցուցանիշներ', cn: '财务表现' },
  dash_ai_insights: { ru: 'Инсайты', en: 'Insights', am: 'ինսայթներ', cn: '见解' },
  dash_active_list: { ru: 'АКТИВНЫЕ ПРОЕКТЫ', en: 'ACTIVE PROJECTS', am: 'ԱԿՏԻՎ ՆԱԽԱԳԾԵՐ', cn: '活动列表' },
  dash_no_projects: { ru: 'У вас пока нет активных проектов', en: 'You have no active projects yet', am: 'Դուք դեռ ակտիվ նախագծեր չունեք', cn: '您目前没有进行中的项目' },

  // Buttons
  // btn_find_talent removed duplicate
  // btn_be_freelancer removed duplicate
  btn_login: { ru: 'Вход', en: 'Login', am: 'ՄՈՒՏՔ', cn: '登录' },
  btn_register: { ru: 'Регистрация', en: 'Register', am: 'Գրանցում', cn: '注册' },
  btn_save: { ru: 'Сохранить изменения', en: 'Save Changes', am: 'Պահպանել', cn: '保存更改' },

  // Profile
  prof_hired: { ru: 'Нанять', en: 'Hire', am: 'Վարձել', cn: '雇用' },
  prof_rating: { ru: 'Рейтинг', en: 'Rating', am: 'Վարկանիշ', cn: '评分' },
  prof_success: { ru: 'Успех заказов', en: 'Success', am: 'Հաջողություն', cn: '成功' },
  prof_earned: { ru: 'Заработано', en: 'Earned', am: 'Վաստակած', cn: '已赚取' },
  prof_status: { ru: 'Статус', en: 'Status', am: 'Կարգավիճակ', cn: '状态' },
  prof_location: { ru: 'Местоположение', en: 'Location', am: 'Գտնվելու վայրը', cn: '地点' },
  prof_member_since: { ru: 'В системе с', en: 'Member since', am: 'Անդամ է սկսած', cn: '成员自' },
  prof_languages: { ru: 'Языки', en: 'Languages', am: 'Լեզուներ', cn: '语言' },
  prof_skills_title: { ru: 'Навыки', en: 'Skills', am: 'Հմտություններ', cn: '技能' },
  prof_about_title: { ru: 'Сущность профиля', en: 'Profile Essence', am: 'Պրոֆիլի էությունը', cn: '个人资料本质' },
  prof_portfolio_title: { ru: 'ПОРТФОЛИО', en: 'PORTFOLIO', am: 'ՊՈՐՏՖՈԼԻՈ', cn: '作品集' },
  prof_reviews_title: { ru: 'ОТЗЫВЫ', en: 'REVIEWS', am: 'ԿԱՐԾԻՔՆԵՐ', cn: '评价' },
  prof_about_text: { 
    ru: 'Мультидисциплинарный архитектор систем. Специализируюсь на высокопроизводительных интерфейсах и децентрализованных сетях.', 
    en: 'Multidisciplinary systems architect. Specialized in high-performance interfaces and decentralized networks.', 
    am: 'Բազմամասնագիտական համակարգերի ճարտարապետ: Մասնագիտացված բարձր արդյունավետությամբ ինտերֆեյսների և ապակենտրոնացված ցանցերի մեջ:', 
    cn: '多学科系统架构师。专注于高性能接口和去中心化网络。' 
  },
  
  // Settings
  settings_title: { ru: 'Настройки', en: 'Settings', am: 'Կարգավորումներ', cn: '设置' },
  settings_profile: { ru: 'Профиль', en: 'Profile', am: 'Պրոֆիլ', cn: '个人资料' },
  settings_security: { ru: 'Безопасность', en: 'Security', am: 'Անվտանգություն', cn: '安全' },
  settings_notifications: { ru: 'Уведомления', en: 'Notifications', am: 'Ծանուցումներ', cn: '通知' },
  settings_payments: { ru: 'Платежи', en: 'Payments', am: 'Վճարումներ', cn: '支付' },
  settings_language: { ru: 'Язык', en: 'Language', am: 'Լեզու', cn: '语言' },

  // Order Details
  order_manifest: { ru: 'ПРОЕКТНЫЙ МАНИФЕСТ', en: 'PROJECT MANIFEST', am: 'ՆԱԽԱԳԾԻ ՄԱՆԻՖԵՍՏ', cn: '项目宣言' },
  order_back: { ru: 'Назад в Нексус', en: 'Back to Nexus', am: 'Հետ դեպի Նեքսուս', cn: '返回枢纽' },
  order_connect: { ru: 'Связаться', en: 'Connect', am: 'Կապվել', cn: '联系' },
  order_apply: { ru: 'Откликнуться', en: 'Apply Now', am: 'Դիմել', cn: '立即申请' },
  order_active: { ru: 'АКТИВНАЯ ВОЗМОЖНОСТЬ', en: 'ACTIVE OPPORTUNITY', am: 'ԱԿՏԻՎ ՀՆԱՐԱՎՈՒԹՅՈՒՆ', cn: '活动机会' },
  order_core: { ru: 'Ядро Объектива', en: 'Objective Core', am: 'Հիմնական նպատակը', cn: '核心目标' },
  order_attachments: { ru: 'Технические приложения', en: 'Technical Attachments', am: 'Տեխնիկական հավելվածներ', cn: '技术附件' },
  order_milestones: { ru: 'ЭТАПЫ ПРОЕКТА', en: 'PROJECT MILESTONES', am: 'ՆԱԽԱԳԾԻ ՓՈՒԼԵՐԸ', cn: '项目里程碑' },
  order_client_origin: { ru: 'Происхождение контракта', en: 'Contract Origin', am: 'Պայմանագրի ծագումը', cn: '合同来源' },
  order_verified_corp: { ru: 'Верифицированная корпорация', en: 'Verified Corporation', am: 'Ստուգված կորպորացիա', cn: '认证公司' },
  order_total_spent: { ru: 'Всего потрачено', en: 'Total Spent', am: 'Ընդհանուր ծախսված', cn: '总支出' },
  order_security_protocol: { ru: 'Протокол безопасности', en: 'Security Protocol', am: 'Անվտանգության արձанագրություն', cn: '安全协议' },
  order_security_text: { 
    ru: 'NEO-LANCE верифицировал этого клиента. Эскроу обязателен. Никогда не платите вне платформы.', 
    en: 'NEO-LANCE verified this client. Escrow is mandatory. Never pay outside the platform.', 
    am: 'NEO-LANCE-ը ստուգել է այս հաճախորդին: Էսքրոուն պարտադիր է: Երբեք մի վճարեք հարթակից դուրս:', 
    cn: 'NEO-LANCE 已验证此客户。托管是强制性的。切勿在平台之外付款。' 
  },
  // Payments
  pay_center: { ru: 'ФИНАНСОВЫЙ ЦЕНТР', en: 'FINANCIAL CENTER', am: 'ՖԻՆԱՆՍԱԿԱՆ ԿԵՆՏՐՈՆ', cn: '财务中心' },
  pay_subtitle: { ru: 'Мгновенные переводы через шлюз Neo-Escrow.', en: 'Instant transfers via Neo-Escrow gateway.', am: 'Ակնթարթային փոխանցումներ Neo-Escrow-ի միջոցով:', cn: '通过 Neo-Escrow 网关实时转账。' },
  pay_withdraw: { ru: 'Вывести', en: 'Withdraw', am: 'Կանխիկացնել', cn: '提现' },
  pay_deposit: { ru: 'Пополнить', en: 'Deposit', am: 'Համալրել', cn: '充值' },
  pay_methods: { ru: 'Методы вывода', en: 'Withdrawal Methods', am: 'Կանխիկացման մեթոդներ', cn: '提现方式' },
  pay_add_method: { ru: 'Добавить метод', en: 'Add Method', am: 'Ավելացնել մեթոդ', cn: '添加方式' },
  pay_secure_net: { ru: 'Безопасная сеть', en: 'Secure Network', am: 'Ապահով ցանց', cn: '安全网络' },
  pay_secure_text: { ru: 'Ваши средства застрахованы Neo-Lance Security Vault.', en: 'Your funds are insured by Neo-Lance Security Vault.', am: 'Ձեր միջոցները ապահովագրված են Neo-Lance Security Vault-ի կողմից:', cn: '您的资金由 Neo-Lance Security Vault 承担保险。' },
  pay_no_history: { ru: 'История транзакций пока чиста', en: 'Transaction history is clear for now', am: 'Գործարքների պատմությունը դեռ դատարկ է', cn: '目前交易历史为空' },
  
  // Reviews
  rev_title: { ru: 'ОТЗЫВЫ КЛИЕНТОВ', en: 'CLIENT REVIEWS', am: 'ՀԱՃԱԽՈՐԴՆԵՐԻ ԿԱՐԾԻՔՆԵՐԸ', cn: '客户评价' },
  rev_subtitle: { ru: 'Доверие, подкрепленное доказательствами в блокчейне.', en: 'Trust backed by evidence in the blockchain.', am: 'Վստահություն՝ հաստատված բլոկչեյնի ապացույցներով:', cn: '信任由区块链证据支撑。' },
  rev_filter: { ru: 'Фильтр', en: 'Filter', am: 'Ֆիլտր', cn: '过滤' },
  rev_write: { ru: 'Написать отзыв', en: 'Write a Review', am: 'Գրել կարծիք', cn: '写评价' },
  rev_platform_rating: { ru: 'Общий рейтинг платформы', en: 'Overall Platform Rating', am: 'Պլատֆորմի ընդհանուր վարկանիշը', cn: '平台总评分' },
  rev_integrity: { ru: 'Проверка честности', en: 'Integrity Verification', am: 'Ազնվության ստուգում', cn: '正直性验证' },
  rev_integrity_text: { ru: 'Все отзывы проходят верификацию и привязаны к смарт-контрактам.', en: 'All reviews undergo verification and are linked to smart contracts.', am: 'Բոլոր կարծիքները անցնում են ստուգում և կապված են սմարթ-կոնտրակտների հետ:', cn: '所有评价都经过验证并链接到智能合约。' },
  rev_project: { ru: 'Проект', en: 'Project', am: 'Նախագիծ', cn: '项目' },
  rev_no_reviews: { ru: 'Отзывов от клиентов пока нет', en: 'No client reviews yet', am: 'Հաճախորդների կարծիքներ դեռ չկան', cn: '目前没有客户评价' },
  
  // Create Order
  co_title: { ru: 'ИНТЕРФЕЙС СОЗДАНИЯ ЗАКАЗА', en: 'ORDER CREATION INTERFACE', am: 'ՊԱՏՎԵՐԻ ՍՏԵՂԾՄԱՆ ԻՆՏԵՐՖԵՅՍ', cn: '订单创建界面' },
  co_subtitle: { ru: 'Настройте ваш запрос для достижения элитных результатов.', en: 'Setup your request to achieve elite results.', am: 'Կարգավորեք ձեր հարցումը:', cn: '设置您的请求，以取得精英般的成果。' },
  co_step_1: { ru: 'Базовая инфо', en: 'Basic Info', am: 'Հիմնական տեղեկություն', cn: '基本信息' },
  co_step_2: { ru: 'Техданные', en: 'Tech Specs', am: 'Տեխնիկական տվյալներ', cn: '技术规格' },
  co_step_3: { ru: 'Бюджет', en: 'Budget', am: 'Բյուջե', cn: '预算' },
  co_step_4: { ru: 'Запуск', en: 'Launch', am: 'Գործարկում', cn: '发布' },
  co_label_title: { ru: 'Заголовок / Название проекта', en: 'Project Title / Name', am: 'Նախագծի վերնագիր', cn: '项目标题/名称' },
  co_label_desc: { ru: 'Видение / Техническое задание', en: 'Vision / Technical Specs', am: 'Տեխնիկական առաջադրանք', cn: '愿景/技术规格' },
  co_label_industry: { ru: 'Индустрия / Технический вектор', en: 'Industry / Technical Vector', am: 'Ինդուստրիա / Տեխնիկական վեկտոր', cn: '行业/技术向量' },
  co_label_expertise: { ru: 'Уровень экспертизы', en: 'Expertise Level', am: 'Փորձաքննության մակարդակը', cn: '专业水平' },
  co_label_files: { ru: 'Ресурсы / Приложения', en: 'Resources / Attachments', am: 'Ռեսուրսներ / Հավելվածներ', cn: '资源/附件' },
  co_budget_limit: { ru: 'Лимит бюджета (USD)', en: 'Budget Limit (USD)', am: 'Բյուջեի սահմանաչափ (USD)', cn: '预算限制 (美元)' },
  co_fixed_price: { ru: 'ФИКСИРОВАННАЯ ЦЕНА', en: 'FIXED PRICE', am: 'ՖԻՔՍՎԱԾ ԳԻՆ', cn: '固定价格' },
  co_hourly: { ru: 'ПОЧАСОВАЯ ОПЛАТА', en: 'HOURLY RATE', am: 'ԺԱՄԱՎՃԱՐ', cn: '按小时计费' },
  co_launch_ready: { ru: 'ПРОЕКТ ГОТОВ К ТРАНСЛЯЦИИ', en: 'PROJECT READY FOR BROADCAST', am: 'ՆԱԽԱԳԻԾԸ ՊԱՏՐԱՍՏ Է ԳՈՐԾԱՐԿՄԱՆ', cn: '项目准备发布' },
  co_back: { ru: 'Назад', en: 'Back', am: 'Հետ', cn: '返回' },
  co_next: { ru: 'Следующий модуль', en: 'Next Module', am: 'Հաջորդ մոդուլը', cn: '下一模块' },
  co_confirm: { ru: 'Подтвердить и запустить', en: 'Confirm and Launch', am: 'Հաստատել և գործարկել', cn: '确认并发布' },
  co_escrow_active: { ru: 'Эскроу защита активна', en: 'Escrow protection active', am: 'Էսքրոու պաշտպանությունը ակտիվ է', cn: '托管保护激活' },
  co_escrow_desc: { ru: 'Средства будут заморожены и выплачены только после вашего утверждения этапов.', en: 'Funds will be frozen and paid only after your approval of milestones.', am: 'Միջոցները կսառեցվեն և կվճարվեն միայն ձեր հաստատումից հետո:', cn: '资金将被冻结，仅在您批准里程碑后支付。' },
  co_ai_assistant: { ru: 'Помощник Системы', en: 'System Assistant', am: 'Համակարգի օգնական', cn: '系统助手' },
  co_ai_active: { ru: 'Активен', en: 'Active', am: 'Ակտիվ', cn: '活跃' },

  // Analytics
  ana_title: { ru: 'АНАЛИТИКА', en: 'ANALYTICS', am: 'ԱՆԱԼԻՏԻԿԱ', cn: '分析' },
  ana_subtitle: { ru: 'Глубокие метрики производительности системы.', en: 'Deep metrics of system performance.', am: 'Համակարգի արդյունավետության խորը մետրիկաներ:', cn: '系统性能的深度指标。' },
  ana_expected_revenue: { ru: 'Ожидаемый годовой доход', en: 'Expected Annual Revenue', am: 'Ակնկալվող տարեկան եկամուտ', cn: '预期年收入' },
  ana_trust_index: { ru: 'Индекс репутации', en: 'Trust Index', am: 'Հեղինակության ինդեքս', cn: '信任指数' },
  ana_global_rank: { ru: 'Мировой рейтинг навыков', en: 'Global Skills Rank', am: 'Հմտությունների համաշխարհային վարկանիշ', cn: '全球技能排名' },
  ana_weekly_dist: { ru: 'Еженедельное распределение', en: 'Weekly Distribution', am: 'Շաբաթական բաշխում', cn: '每周分布' },
  ana_ecosystem_revenue: { ru: 'Доход по экосистемам', en: 'Ecosystem Revenue', am: 'Եկամուտ ըստ էկոհամակարգերի', cn: '生态系统收入' },
  ana_strategy_title: { ru: 'РАСШИРЬТЕ СВОЕ ПРИСУТСТВИЕ', en: 'EXPAND YOUR PRESENCE', am: 'ԸՆԴԼԱՅՆԵԼ ՁԵՐ ՆԵՐԿԱՅՈՒԹՅՈՒՆԸ', cn: '扩展您的存在' },
  ana_optimize: { ru: 'Оптимизировать', en: 'Optimize Now', am: 'Օպտիմալացնել', cn: '立即优化' },
  ana_full_report: { ru: 'Полный отчет', en: 'Full Report', am: 'Ամբողջական հաշվետվություն', cn: '完整报告' },
  ana_no_data: { ru: 'Данные телеметрии пока отсутствуют', en: 'Telemetry data unavailable yet', am: 'Տվյալները դեռ հասանելի չեն', cn: '遥测数据暂不可用' },
  
  // Chat
  chat_title: { ru: 'СООБЩЕНИЯ', en: 'MESSAGES', am: 'ՀԱՂՈՐԴԱԳՐՈՒԹՅՈՒՆՆԵՐ', cn: '消息' },
  chat_search: { ru: 'Поиск в зашифрованных чатах...', en: 'Search in encrypted chats...', am: 'Փնտրել գաղտնագրված չատերում...', cn: '在加密聊天中搜索...' },
  chat_secure: { ru: 'Защищенный E2E Интерфейс', en: 'Secure E2E Interface', am: 'Ապահով E2E ինտերֆեյս', cn: '安全 E2E 接口' },
  chat_typing: { ru: 'печатает...', en: 'is typing...', am: 'գրում է...', cn: '正在输入...' },
  chat_input_placeholder: { ru: 'Введите сообщение...', en: 'Type a message...', am: 'Մուտքագրեք հաղորդագրություն...', cn: '输入消息...' },
  chat_no_messages: { ru: 'Выберите контакт для начала общения', en: 'Select a contact to start communication', am: 'Ընտրեք կոնտակտը հաղորդակցությունը սկսելու համար', cn: '选择联系人开始交流' },
  chat_no_contacts: { ru: 'Список контактов пуст', en: 'Contact list is empty', am: 'Կոնտակտների ցանկը դատարկ է', cn: '联系人列表为空' },

  // Auth Extra
  auth_avatar_label: { ru: 'Имя профиля', en: 'Profile Name', am: 'Պրոֆիլի անունը', cn: '个人资料名称' },
  auth_name_placeholder: { ru: 'Ваше имя', en: 'Your Name', am: 'Ձեր անունը', cn: '您的姓名' },

  // Support
  sup_title: { ru: 'ЦЕНТР ПОДДЕРЖКИ', en: 'SUPPORT CENTER', am: 'ԱՋԱԿՑՈՒԹՅԱՆ ԿԵՆՏՐՈՆ', cn: '支持中心' },
  sup_subtitle: { ru: 'Взаимодействуйте с нашими протоколами поддержки.', en: 'Interact with our support protocols.', am: 'Փոխազդեք մեր աջակցության արձանագրությունների հետ:', cn: '与我们的支持协议进行交互。' },
  sup_search: { ru: 'Поиск по базе знаний...', en: 'Search knowledge base...', am: 'Փնտրել գիտելիքների բազայում...', cn: '搜索知识库...' },
  sup_ai_bot: { ru: 'Чатбот', en: 'Chatbot', am: 'Չատբոտ', cn: '聊天机器人' },
  sup_ai_bot_desc: { ru: 'Взаимодействуйте с нашим круглосуточным агентом.', en: 'Interact with our 24/7 agent.', am: 'Փոխազդեք մեր շուրջօրյա գործակալի հետ:', cn: '与我们的 24/7 代理进行交互。' },
  sup_direct: { ru: 'Прямая связь', en: 'Direct Link', am: 'Ուղիղ կապ', cn: '直接链接' },
  sup_direct_desc: { ru: 'Откройте высокоприоритетный туннель связи.', en: 'Open a high-priority communication tunnel.', am: 'Բացեք բարձր առաջնահերթության հաղորդակցման թունել:', cn: '开启高优先级通信隧道。' },
  sup_protocols: { ru: 'Протоколы', en: 'Protocols', am: 'Արձանագրություններ', cn: '协议' },
  sup_protocols_desc: { ru: 'Изучите глубокую документацию по правилам.', en: 'Explore deep documentation on rules.', am: 'Ուսումնասիրեք կանոնների խորը փաստաթղթերը:', cn: '探索有关规则的深度文档。' },
  sup_faqs: { ru: 'ЧАСТЫЕ ЗАПРОСЫ', en: 'FREQUENT QUERIES', am: 'ՀԱՃԱԽԱԿԻ ՀԱՐՑՈՒՄՆԵՐ', cn: '常见查询' },
  sup_connect: { ru: 'Подключиться', en: 'Connect', am: 'Միանալ', cn: '连接' },
  sup_ai_ass_msg: { ru: 'Чем я могу помочь сегодня?', en: 'How can I assist you today?', am: 'Ինչպե՞ս կարող եմ օգնել այսօր:', cn: '今天我能为您提供什么帮助？' },

  // Footer & Misc
  footer_desc: { ru: 'Экосистема фриланса нового поколения для элитных специалистов и инновационных компаний.', en: 'Next-generation freelance ecosystem for elite specialists and innovative companies.', am: 'Ֆրիլանսի հաջորդ սերնդի էկոհամակարգ էլիտար մասնագետների և նորարար ընկերությունների համար:', cn: '面向精英专家和创新公司的下一代自由职业生态系统。' },
  footer_platform: { ru: 'Платформа', en: 'Platform', am: 'Պլատֆորմ', cn: '平台' },
  footer_talents: { ru: 'Таланты', en: 'Talents', am: 'Տաղանդներ', cn: '人才' },
  footer_tools: { ru: 'Инструменты', en: 'Tools', am: 'Գործիքներ', cn: '工具' },
  footer_help: { ru: 'Помощь', en: 'Help', am: 'Օգնություն', cn: '帮助' },
  footer_community: { ru: 'Сообщество', en: 'Community', am: 'Համայնք', cn: '社区' },
  footer_contacts: { ru: 'Контакты', en: 'Contact', am: 'Կոնտակտներ', cn: '联系方式' },
  footer_rights: { ru: 'ВСЕ ПРАВА ЗАЩИЩЕНЫ', en: 'ALL RIGHTS RESERVED', am: 'ԲՈԼՈՐ ԻՐԱՎՈՒՆՔՆԵՐԸ ՊԱՇՏՊԱՆՎԱԾ ԵՆ', cn: '保留所有权利' },
  footer_privacy: { ru: 'Приватность', en: 'Privacy', am: 'Գաղտնիություն', cn: '隐私' },
  footer_terms: { ru: 'Условия', en: 'Terms', am: 'Պայմաններ', cn: '条款' },

  // Profile Extra
  prof_languages_archive: { ru: 'Английский, Русский', en: 'English, Russian', am: 'Անգլերեն, Ռուսերեն', cn: '英语, 俄语' },
  prof_view_archive: { ru: 'Весь архив', en: 'Full Archive', am: 'Ամբողջ արխիվը', cn: '完整档案' },
  prof_inspect_code: { ru: 'Изучить код', en: 'Inspect Code', am: 'Ուսումնասիրել կոդը', cn: '检查代码' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
