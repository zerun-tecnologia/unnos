--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: Guild; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guild" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Guild" OWNER TO postgres;

--
-- Name: Match; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    name text,
    "guildId" text NOT NULL,
    "winnerId" text,
    status text DEFAULT 'open'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finishedAt" timestamp(3) without time zone
);


ALTER TABLE public."Match" OWNER TO postgres;

--
-- Name: MatchBanned; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MatchBanned" (
    "matchId" integer NOT NULL,
    "userId" text NOT NULL,
    count integer NOT NULL
);


ALTER TABLE public."MatchBanned" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Match_id_seq" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _match_gave; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._match_gave (
    "A" integer NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public._match_gave OWNER TO postgres;

--
-- Name: _match_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._match_participants (
    "A" integer NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public._match_participants OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: _user_guilds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._user_guilds (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public._user_guilds OWNER TO postgres;

--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Data for Name: Guild; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guild" (id, name) FROM stdin;
1085747046608293928	Zerun Studio
692063300804018217	IT Kingspan Isoeste
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Match" (id, name, "guildId", "winnerId", status, "createdAt", "finishedAt") FROM stdin;
1	\N	692063300804018217	1170074722424344657	closed	2025-03-21 14:52:58.469	2025-03-21 14:59:35.394
28	\N	692063300804018217	1197666171852427326	closed	2025-03-27 15:17:11.839	2025-03-27 15:19:27.56
2	\N	692063300804018217	1170074722424344657	closed	2025-03-21 14:59:35.408	2025-03-21 15:01:31.884
3	\N	692063300804018217	256152309803778048	closed	2025-03-21 15:01:31.887	2025-03-21 15:08:26.121
4	\N	692063300804018217	669223464284192808	closed	2025-03-21 15:08:26.128	2025-03-21 15:11:04.812
29	\N	692063300804018217	765572736214761512	closed	2025-03-27 15:19:27.565	2025-03-27 15:27:16.292
5	\N	692063300804018217	256152309803778048	closed	2025-03-21 15:11:04.815	2025-03-21 15:14:46.218
6	\N	692063300804018217	1170074722424344657	closed	2025-03-21 15:14:46.221	2025-03-21 15:17:51.618
7	\N	692063300804018217	1197666171852427326	closed	2025-03-21 15:17:51.621	2025-03-21 15:22:59.545
30	\N	692063300804018217	1220774454263812146	closed	2025-03-27 15:27:16.295	2025-03-27 15:27:26.832
8	\N	692063300804018217	669223464284192808	closed	2025-03-21 15:22:59.548	2025-03-21 15:27:40.664
9	\N	692063300804018217	669223464284192808	closed	2025-03-21 15:27:40.667	2025-03-24 16:04:59.298
10	<@691773031823179808>	692063300804018217	669223464284192808	closed	2025-03-24 16:04:59.307	2025-03-25 14:40:37.485
31	\N	692063300804018217	1220774454263812146	closed	2025-03-27 15:27:26.836	2025-03-27 15:38:12.443
11	\N	692063300804018217	1170074722424344657	closed	2025-03-25 14:40:37.492	2025-03-25 15:09:35.432
12	\N	692063300804018217	357015751057735682	closed	2025-03-25 15:09:35.436	2025-03-25 15:11:00.434
13	\N	692063300804018217	1170074722424344657	closed	2025-03-25 15:11:00.438	2025-03-25 15:13:10.031
14	\N	692063300804018217	1197666171852427326	closed	2025-03-25 15:13:10.034	2025-03-25 15:22:07.156
15	\N	692063300804018217	256152309803778048	closed	2025-03-25 15:22:07.161	2025-03-25 15:27:05.478
16	\N	692063300804018217	765572736214761512	closed	2025-03-25 15:27:05.482	2025-03-25 15:33:16.167
17	\N	692063300804018217	653398184563048520	closed	2025-03-25 15:33:16.171	2025-03-25 15:37:32.629
18	\N	692063300804018217	765572736214761512	closed	2025-03-25 15:37:32.632	2025-03-25 15:43:29.788
19	\N	692063300804018217	691773031823179808	closed	2025-03-25 15:43:29.791	2025-03-26 14:51:54.049
20	\N	692063300804018217	\N	closed	2025-03-26 14:51:54.062	2025-03-26 15:01:19.56
21	\N	692063300804018217	1197666171852427326	closed	2025-03-26 15:01:19.566	2025-03-26 15:05:42.504
22	\N	692063300804018217	1170074722424344657	closed	2025-03-26 15:05:42.507	2025-03-26 15:14:56.752
23	\N	692063300804018217	357015751057735682	closed	2025-03-26 15:14:56.756	2025-03-26 15:17:50.746
24	\N	692063300804018217	357015751057735682	closed	2025-03-26 15:17:50.749	2025-03-26 15:20:35.027
25	\N	692063300804018217	765572736214761512	closed	2025-03-26 15:20:35.031	2025-03-26 15:24:32.165
26	\N	692063300804018217	1170074722424344657	closed	2025-03-26 15:24:32.168	2025-03-26 15:31:40.431
27	\N	692063300804018217	765572736214761512	closed	2025-03-27 15:09:37.311	2025-03-27 15:17:11.82
\.


--
-- Data for Name: MatchBanned; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MatchBanned" ("matchId", "userId", count) FROM stdin;
10	1170074722424344657	0
10	691773031823179808	0
10	1197666171852427326	0
10	1220774454263812146	0
10	357015751057735682	0
11	765572736214761512	34
11	669223464284192808	28
12	653398184563048520	38
14	357015751057735682	34
14	765572736214761512	26
15	653398184563048520	28
16	1197666171852427326	38
17	1197666171852427326	34
18	653398184563048520	48
20	943683279389851698	46
20	765572736214761512	28
21	765572736214761512	0
22	669223464284192808	50
22	943683279389851698	50
23	256152309803778048	28
24	669223464284192808	36
26	943683279389851698	48
27	1197666171852427326	28
27	692083454015176735	26
27	1220774454263812146	30
29	692083454015176735	28
29	1197666171852427326	30
31	765572736214761512	26
31	1197666171852427326	32
31	692083454015176735	26
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username) FROM stdin;
765572736214761512	baraus.dev
1197666171852427326	suellensousa
692083454015176735	gleidsonti3287
1220774454263812146	michelle.melo_05425
669223464284192808	alexandrebessa0969
357015751057735682	fanuelds
943683279389851698	fanuel9948
1170074722424344657	gedeon_53533
653398184563048520	mauriciolsfilho
171643000311644160	romulo0087
256152309803778048	andnikk
691773031823179808	pedroveras_
\.


--
-- Data for Name: _match_gave; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._match_gave ("A", "B") FROM stdin;
1	256152309803778048
2	357015751057735682
3	691773031823179808
4	691773031823179808
4	357015751057735682
5	691773031823179808
6	943683279389851698
7	256152309803778048
8	256152309803778048
9	357015751057735682
10	256152309803778048
12	1197666171852427326
13	653398184563048520
14	669223464284192808
15	669223464284192808
18	357015751057735682
19	256152309803778048
21	691773031823179808
22	765572736214761512
22	1197666171852427326
23	1170074722424344657
25	691773031823179808
26	256152309803778048
27	256152309803778048
27	691773031823179808
\.


--
-- Data for Name: _match_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._match_participants ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9f2f9cc2-87e2-4f43-9ef1-9af66a287140	4b34242b0f655a5b6071982117df765de1ca1ca5d6998b87fcc8df7cac6efc97	2025-03-20 18:58:50.468182+00	20250320183737_init	\N	\N	2025-03-20 18:58:50.445867+00	1
\.


--
-- Data for Name: _user_guilds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._user_guilds ("A", "B") FROM stdin;
692063300804018217	171643000311644160
1085747046608293928	765572736214761512
692063300804018217	256152309803778048
692063300804018217	1170074722424344657
692063300804018217	357015751057735682
692063300804018217	691773031823179808
692063300804018217	669223464284192808
692063300804018217	943683279389851698
692063300804018217	1197666171852427326
692063300804018217	1220774454263812146
692063300804018217	765572736214761512
692063300804018217	653398184563048520
692063300804018217	692083454015176735
\.


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Match_id_seq"', 31, true);


--
-- Name: Guild Guild_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guild"
    ADD CONSTRAINT "Guild_pkey" PRIMARY KEY (id);


--
-- Name: MatchBanned MatchBanned_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MatchBanned"
    ADD CONSTRAINT "MatchBanned_pkey" PRIMARY KEY ("matchId", "userId");


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _match_gave _match_gave_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._match_gave
    ADD CONSTRAINT "_match_gave_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _match_participants _match_participants_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._match_participants
    ADD CONSTRAINT "_match_participants_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: _user_guilds _user_guilds_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user_guilds
    ADD CONSTRAINT "_user_guilds_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: _match_gave_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_match_gave_B_index" ON public._match_gave USING btree ("B");


--
-- Name: _match_participants_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_match_participants_B_index" ON public._match_participants USING btree ("B");


--
-- Name: _user_guilds_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_user_guilds_B_index" ON public._user_guilds USING btree ("B");


--
-- Name: MatchBanned MatchBanned_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MatchBanned"
    ADD CONSTRAINT "MatchBanned_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MatchBanned MatchBanned_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MatchBanned"
    ADD CONSTRAINT "MatchBanned_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_guildId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES public."Guild"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_winnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _match_gave _match_gave_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._match_gave
    ADD CONSTRAINT "_match_gave_A_fkey" FOREIGN KEY ("A") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _match_gave _match_gave_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._match_gave
    ADD CONSTRAINT "_match_gave_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _match_participants _match_participants_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._match_participants
    ADD CONSTRAINT "_match_participants_A_fkey" FOREIGN KEY ("A") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _match_participants _match_participants_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._match_participants
    ADD CONSTRAINT "_match_participants_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _user_guilds _user_guilds_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user_guilds
    ADD CONSTRAINT "_user_guilds_A_fkey" FOREIGN KEY ("A") REFERENCES public."Guild"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _user_guilds _user_guilds_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user_guilds
    ADD CONSTRAINT "_user_guilds_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

