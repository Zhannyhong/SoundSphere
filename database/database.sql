--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    body character varying(1000) NOT NULL,
    thread_id bigint,
    user_id bigint
);


ALTER TABLE public.comments OWNER TO "user";

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO "user";

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.tags OWNER TO "user";

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO "user";

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: thread_tags; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.thread_tags (
    thread_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


ALTER TABLE public.thread_tags OWNER TO "user";

--
-- Name: threads; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.threads (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    title character varying(300) NOT NULL,
    body character varying(5000),
    user_id bigint
);


ALTER TABLE public.threads OWNER TO "user";

--
-- Name: threads_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.threads_id_seq OWNER TO "user";

--
-- Name: threads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.threads_id_seq OWNED BY public.threads.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    username character varying(20) NOT NULL,
    password character varying(60) NOT NULL
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.votes (
    thread_id bigint NOT NULL,
    user_id bigint NOT NULL,
    vote bigint,
    created_at timestamp with time zone
);


ALTER TABLE public.votes OWNER TO "user";

--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: threads id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads ALTER COLUMN id SET DEFAULT nextval('public.threads_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.comments (id, created_at, updated_at, deleted_at, body, thread_id, user_id) FROM stdin;
2	2024-01-25 15:34:35.265761+08	2024-01-25 15:34:35.265761+08	\N	I have a few on repeat right now:\n\n1. Valentine - Inhaler\n2. Apocalypse - Cigarettes After Sex\n3. Wings - So!YoON!, Phum Viphurit	2	1
3	2024-01-25 15:35:27.541263+08	2024-01-25 15:35:27.541263+08	\N	For me its:\n\n1. Selfless - The Strokes\n2. My Love Mine All Mine - Mitski	2	3
4	2024-01-25 15:36:49.088732+08	2024-01-25 15:36:49.088732+08	\N	Oh yeah The Strokes is pretty good! Kinda hooked rn	2	2
5	2024-01-25 15:42:37.258943+08	2024-01-25 15:42:37.258943+08	\N	Favourite has to be "Can I Call You Tonight" as it just means so much to me. Least favourite would probably be "Run the World" if I was forced to choose but I still love it! Amazing indie pop album from such an underrated band imo.	4	1
6	2024-01-25 15:43:19.781302+08	2024-01-25 15:43:19.781302+08	\N	For me, it is a tie between False Direction and Listerine. I have both on repeat constantly. Dayglow has completely taken over! Every other artist/band on my Spotify has been very neglected.	4	2
8	2024-01-25 15:47:24.418611+08	2024-01-25 15:47:24.418611+08	\N	Great list! Personally I like More Than A Woman - SG's Paradise Edit too	3	1
1	2024-01-25 15:30:34.704888+08	2024-01-25 17:04:54.316784+08	\N	OMG I went for it too! But I went on the second day.	1	2
7	2024-01-25 15:45:44.695229+08	2024-01-25 17:04:54.316784+08	\N	Heard they only played In My Place from the second day onwards 😢😭 what a shame i missed it	1	1
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.tags (id, name) FROM stdin;
1	blues
2	classical
3	country
4	electronic
5	folk
6	hip-hop
7	jazz
8	reggae
11	r&b
12	rap
13	metal
14	indie
9	pop
10	rock
\.


--
-- Data for Name: thread_tags; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.thread_tags (thread_id, tag_id) FROM stdin;
1	9
1	10
2	14
3	14
4	14
4	9
2	1
2	2
2	3
2	4
2	5
2	6
2	7
2	9
2	8
2	10
2	11
2	12
2	13
\.


--
-- Data for Name: threads; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.threads (id, created_at, updated_at, deleted_at, title, body, user_id) FROM stdin;
4	2024-01-25 15:12:30.81527+08	2024-01-25 15:14:03.43615+08	\N	Dayglow - Fuzzybrain (Album thread)	So with the final two tracks of Fuzzybrain being released, the album is finally in it's completed form! Thought I'd make one thread for general discussion regarding the album!\n\nTrack listing:-\n\nFalse Direction\nCan I Call You Tonight?\nHot Rod\nRun The World!!!\nFair Game\nDear Friend,\nFuzzybrain\nJunior Varsity\nNicknames\nListerine\n\nWhat's your favourite song? Least favourite song? What do you like about the album? What do you dislike? Let's chat about FUZZYBRAIN ✌🏻🤷🏻‍♂️	3
2	2024-01-25 15:05:53.581626+08	2024-01-25 15:18:55.635437+08	\N	What are you listening to right now?		2
3	2024-01-25 15:07:11.524452+08	2024-01-25 15:41:14.245186+08	\N	Sharing some of my favourite songs ❤️	1. Someone That Loves You - HONNE, Izzy Bizu\n2. Can I Call You Tonight? - Dayglow\n3. Outside - Fiji Blue\n4. Dissolve - Absofacto, NITESHIFT\n5. Crying Over You - HONNE, BEKA\n6. Bailey - Valley\n7. Higher - Blanks\n\nFeel free to recommend your own in the comments!	3
1	2024-01-25 15:04:07.34375+08	2024-01-25 17:04:54.31888+08	\N	How was your Coldplay concert experience?	Coldplay played for a mind-blowing 6 DAYS!!!! in Singapore. Did any of you go for it?\n\nI went for the first day and to be honest, it was a little underwhelming because Chris Martin forgot the lyrics to Paradise, and the piano broke down halfway while playing The Scientist... But after he warmed up, it was much MUCH better. A Sky Full of Stars was very vibey!!!	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, created_at, updated_at, deleted_at, username, password) FROM stdin;
2	2024-01-25 15:04:46.556915+08	2024-01-25 15:18:55.631497+08	\N	Ben Dover	$2a$10$u2c0Kc6B8MK0sDnhVmytnevA1v2/doSYRvo3ob84fc4c3rr.CrAAW
3	2024-01-25 15:06:41.051523+08	2024-01-25 15:41:14.243174+08	\N	Mike Hunt	$2a$10$RLfvQ1gc24OPiBbfy0RdHey/lXl1yc1uJX8vb1gAHNKxDqcERvtcy
1	2024-01-25 14:58:46.730468+08	2024-01-25 17:04:54.316076+08	\N	Mike Oxlong	$2a$10$hycSobzhlPTm01dUuMw3Sed2Gb3dJIWfmCUF2tpbO3meKJSSsgaV6
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.votes (thread_id, user_id, vote, created_at) FROM stdin;
3	3	1	2024-01-25 15:41:39.38483+08
3	1	1	2024-01-25 15:48:29.949229+08
2	1	1	2024-01-25 15:48:50.107081+08
4	1	1	2024-01-25 15:49:17.835962+08
3	2	1	2024-01-25 15:49:38.424695+08
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.comments_id_seq', 8, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.tags_id_seq', 16, true);


--
-- Name: threads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.threads_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: thread_tags thread_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.thread_tags
    ADD CONSTRAINT thread_tags_pkey PRIMARY KEY (thread_id, tag_id);


--
-- Name: threads threads_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT threads_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (thread_id, user_id);


--
-- Name: idx_comments_deleted_at; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_comments_deleted_at ON public.comments USING btree (deleted_at);


--
-- Name: idx_threads_deleted_at; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_threads_deleted_at ON public.threads USING btree (deleted_at);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: thread_tags fk_thread_tags_tag; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.thread_tags
    ADD CONSTRAINT fk_thread_tags_tag FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- Name: thread_tags fk_thread_tags_thread; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.thread_tags
    ADD CONSTRAINT fk_thread_tags_thread FOREIGN KEY (thread_id) REFERENCES public.threads(id);


--
-- Name: comments fk_threads_comments; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_threads_comments FOREIGN KEY (thread_id) REFERENCES public.threads(id);


--
-- Name: votes fk_threads_votes; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fk_threads_votes FOREIGN KEY (thread_id) REFERENCES public.threads(id);


--
-- Name: comments fk_users_comments; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_users_comments FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: threads fk_users_threads; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT fk_users_threads FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: votes fk_users_votes; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fk_users_votes FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

