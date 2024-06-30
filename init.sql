--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-06-29 02:26:39

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

--
-- TOC entry 236 (class 1255 OID 17673)
-- Name: check_unique_route_name(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_unique_route_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    route_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO route_count
    FROM exam_route
    WHERE inspector_id = NEW.inspector_id AND name = NEW.name;

    IF route_count > 0 THEN
        RAISE EXCEPTION 'Маршрут с таким названием для данного инспектора уже существует';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_unique_route_name() OWNER TO postgres;

--
-- TOC entry 235 (class 1255 OID 17671)
-- Name: update_student_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_student_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE groups
    SET student_count = student_count + 1
    WHERE id = NEW.group_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_student_count() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 17595)
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    tuition_fees numeric(10,2),
    driving_school_id integer NOT NULL
);


ALTER TABLE public.course OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17594)
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_id_seq OWNER TO postgres;

--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 223
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- TOC entry 220 (class 1259 OID 17570)
-- Name: driving_school; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driving_school (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    contacts character varying(255),
    rating double precision,
    working_hours character varying(255)
);


ALTER TABLE public.driving_school OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17569)
-- Name: driving_school_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driving_school_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driving_school_id_seq OWNER TO postgres;

--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 219
-- Name: driving_school_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driving_school_id_seq OWNED BY public.driving_school.id;


--
-- TOC entry 232 (class 1259 OID 17642)
-- Name: exam_route; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_route (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    conditions character varying(255),
    distance double precision,
    inspector_id integer NOT NULL
);


ALTER TABLE public.exam_route OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17641)
-- Name: exam_route_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_route_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_route_id_seq OWNER TO postgres;

--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 231
-- Name: exam_route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_route_id_seq OWNED BY public.exam_route.id;


--
-- TOC entry 226 (class 1259 OID 17607)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    group_number integer NOT NULL,
    student_count integer,
    course_id integer NOT NULL,
    inspector_id integer
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17606)
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_id_seq OWNER TO postgres;

--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 225
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- TOC entry 230 (class 1259 OID 17633)
-- Name: inspector; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspector (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    salary numeric(10,2),
    passport_data character varying(255),
    work_experience integer,
    user_id integer
);


ALTER TABLE public.inspector OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17632)
-- Name: inspector_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inspector_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inspector_id_seq OWNER TO postgres;

--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 229
-- Name: inspector_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inspector_id_seq OWNED BY public.inspector.id;


--
-- TOC entry 234 (class 1259 OID 17667)
-- Name: inspector_route_info; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.inspector_route_info AS
 SELECT i.full_name AS inspector_name,
    i.work_experience,
    er.name AS route_name,
    er.distance
   FROM (public.inspector i
     JOIN public.exam_route er ON ((i.id = er.inspector_id)));


ALTER VIEW public.inspector_route_info OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17532)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17531)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 222 (class 1259 OID 17579)
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    inn character varying(12) NOT NULL,
    salary numeric(10,2),
    passport_data character varying(255),
    work_experience integer,
    driving_school_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17578)
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 221
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- TOC entry 228 (class 1259 OID 17619)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    passport_data character varying(255),
    group_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17663)
-- Name: student_group_info; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.student_group_info AS
 SELECT s.full_name AS student_name,
    s.passport_data,
    g.group_number,
    c.name AS course_name
   FROM ((public.student s
     JOIN public.groups g ON ((s.group_id = g.id)))
     JOIN public.course c ON ((g.course_id = c.id)));


ALTER VIEW public.student_group_info OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17618)
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_id_seq OWNER TO postgres;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 227
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- TOC entry 216 (class 1259 OID 17477)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role_id integer,
    full_name character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 17476)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4688 (class 2604 OID 17598)
-- Name: course id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 17573)
-- Name: driving_school id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_school ALTER COLUMN id SET DEFAULT nextval('public.driving_school_id_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 17645)
-- Name: exam_route id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_route ALTER COLUMN id SET DEFAULT nextval('public.exam_route_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 17610)
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- TOC entry 4691 (class 2604 OID 17636)
-- Name: inspector id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspector ALTER COLUMN id SET DEFAULT nextval('public.inspector_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 17535)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4687 (class 2604 OID 17582)
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- TOC entry 4690 (class 2604 OID 17622)
-- Name: student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 17480)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4882 (class 0 OID 17595)
-- Dependencies: 224
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.course VALUES (1, 'Курс вождения категории B', 25000.00, 1);
INSERT INTO public.course VALUES (2, 'Курс вождения категории C', 35000.00, 1);
INSERT INTO public.course VALUES (3, 'Курс вождения категории B', 28000.00, 2);
INSERT INTO public.course VALUES (4, 'Курс вождения категории A', 30000.00, 2);


--
-- TOC entry 4878 (class 0 OID 17570)
-- Dependencies: 220
-- Data for Name: driving_school; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.driving_school VALUES (1, 'АвтоПрофи', '8 (495) 123-45-67, info@avtoprofi.ru', 4.8, 'Пн-Пт 09:00-18:00');
INSERT INTO public.driving_school VALUES (2, 'ВождениеПлюс', '8 (499) 567-89-01, office@vozhdenie.ru', 4.6, 'Пн-Сб 10:00-20:00');


--
-- TOC entry 4890 (class 0 OID 17642)
-- Dependencies: 232
-- Data for Name: exam_route; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exam_route VALUES (1, 'Маршрут №1', 'Городской цикл, интенсивное движение', 15.2, 1);
INSERT INTO public.exam_route VALUES (2, 'Маршрут №2', 'Загородный цикл, малая интенсивность движения', 20.5, 2);


--
-- TOC entry 4884 (class 0 OID 17607)
-- Dependencies: 226
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.groups VALUES (1, 101, 8, 1, 1);
INSERT INTO public.groups VALUES (2, 102, 10, 2, 2);
INSERT INTO public.groups VALUES (3, 201, 6, 3, 1);
INSERT INTO public.groups VALUES (4, 202, 9, 4, 2);


--
-- TOC entry 4888 (class 0 OID 17633)
-- Dependencies: 230
-- Data for Name: inspector; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inspector VALUES (1, 'Васильев Василий Васильевич', 60000.00, '1234 567890', 10, NULL);
INSERT INTO public.inspector VALUES (2, 'Григорьева Анна Петровна', 55000.00, '9876 543210', 8, NULL);
INSERT INTO public.inspector VALUES (5, 'Тестовый Тест Тестович', 15000.00, '1111222222', 12, 18);


--
-- TOC entry 4876 (class 0 OID 17532)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles VALUES (1, 'admin');
INSERT INTO public.roles VALUES (2, 'teacher');
INSERT INTO public.roles VALUES (3, 'student');
INSERT INTO public.roles VALUES (4, 'guest');
INSERT INTO public.roles VALUES (5, 'inspector');


--
-- TOC entry 4880 (class 0 OID 17579)
-- Dependencies: 222
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.staff VALUES (1, 'Иванов Иван Иванович', '123456789012', 50000.00, '1234 567890', 5, 1, NULL);
INSERT INTO public.staff VALUES (2, 'Петров Петр Петрович', '987654321098', 45000.00, '9876 543210', 3, 1, NULL);
INSERT INTO public.staff VALUES (3, 'Сидорова Мария Алексеевна', '456789012345', 40000.00, '4567 890123', 2, 2, NULL);
INSERT INTO public.staff VALUES (4, 'Кузнецов Александр Владимирович', '789012345678', 55000.00, '7890 123456', 7, 2, NULL);
INSERT INTO public.staff VALUES (9, 'Николаев Николай Николаевич', '1111111', 99000.00, '9999999999', 9, 2, 19);
INSERT INTO public.staff VALUES (11, 'Иван Иванович Иванов', '2222222222', 22000.00, '2222222222', 22, 2, 22);
INSERT INTO public.staff VALUES (12, 'Иванов Альберт Александрович', '1111114', 13000.00, '2222222221', 9, 1, 23);


--
-- TOC entry 4886 (class 0 OID 17619)
-- Dependencies: 228
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student VALUES (1, 'Смирнов Андрей Михайлович', '1234 567890', 1, NULL);
INSERT INTO public.student VALUES (2, 'Козлова Екатерина Александровна', '9876 543210', 1, NULL);
INSERT INTO public.student VALUES (3, 'Воробьев Максим Сергеевич', '4567 890123', 2, NULL);
INSERT INTO public.student VALUES (4, 'Соколова Ольга Николаевна', '7890 123456', 3, NULL);


--
-- TOC entry 4874 (class 0 OID 17477)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (17, 'admin', '$2a$10$0Tm/5nhQUfPuyBh3RK578uCnnpYuwSf4kBCKHOQOmeCbgIStyLMqa', 1, 'Смолин Иван Григорьевич');
INSERT INTO public.users VALUES (18, 'test', '$2a$10$guFGSXiuX.W0nEmwchrZY.qDuYfNbe9Laii/ltVGUd4J4aHC8Z/y6', 5, 'Тестовый Тест Тестович');
INSERT INTO public.users VALUES (19, 'ttt', '$2a$10$bZ4jxlVgbUcTIoaFRWPDduM9YSovqzPStNnKdkT40CQHJDv9/to1q', 2, 'Николаев Николай Николаевич');
INSERT INTO public.users VALUES (22, 'qwerty', '$2a$10$1GriUi15x9yzQY7jXoDyn.A6Z/yO4DzRJYvrYfvi99wKnevhzTsuS', 2, 'Иван Иванович Иванов');
INSERT INTO public.users VALUES (23, 'albert', '$2a$10$aJOeJJgRurxx31dIzwG2tuazUT.Z/lsD6ETrsqjy7niXw0azvHRpC', 2, 'Иванов Альберт Александрович');


--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 223
-- Name: course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_id_seq', 4, true);


--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 219
-- Name: driving_school_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driving_school_id_seq', 5, true);


--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 231
-- Name: exam_route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exam_route_id_seq', 2, true);


--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 225
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 4, true);


--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 229
-- Name: inspector_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inspector_id_seq', 6, true);


--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 221
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 12, true);


--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 227
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_id_seq', 9, true);


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- TOC entry 4708 (class 2606 OID 17600)
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 17577)
-- Name: driving_school driving_school_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_school
    ADD CONSTRAINT driving_school_pkey PRIMARY KEY (id);


--
-- TOC entry 4716 (class 2606 OID 17651)
-- Name: exam_route exam_route_inspector_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_route
    ADD CONSTRAINT exam_route_inspector_id_key UNIQUE (inspector_id);


--
-- TOC entry 4718 (class 2606 OID 17649)
-- Name: exam_route exam_route_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_route
    ADD CONSTRAINT exam_route_pkey PRIMARY KEY (id);


--
-- TOC entry 4710 (class 2606 OID 17612)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4714 (class 2606 OID 17640)
-- Name: inspector inspector_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspector
    ADD CONSTRAINT inspector_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 17539)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4700 (class 2606 OID 17537)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4704 (class 2606 OID 17588)
-- Name: staff staff_inn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_inn_key UNIQUE (inn);


--
-- TOC entry 4706 (class 2606 OID 17586)
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 17626)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 17484)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 17486)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4727 (class 2620 OID 17674)
-- Name: exam_route check_unique_route_name_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_unique_route_name_trigger BEFORE INSERT OR UPDATE ON public.exam_route FOR EACH ROW EXECUTE FUNCTION public.check_unique_route_name();


--
-- TOC entry 4726 (class 2620 OID 17672)
-- Name: student update_student_count_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_student_count_trigger AFTER INSERT ON public.student FOR EACH ROW EXECUTE FUNCTION public.update_student_count();


--
-- TOC entry 4721 (class 2606 OID 17601)
-- Name: course course_driving_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_driving_school_id_fkey FOREIGN KEY (driving_school_id) REFERENCES public.driving_school(id);


--
-- TOC entry 4725 (class 2606 OID 17652)
-- Name: exam_route exam_route_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_route
    ADD CONSTRAINT exam_route_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.inspector(id);


--
-- TOC entry 4722 (class 2606 OID 17613)
-- Name: groups groups_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id);


--
-- TOC entry 4723 (class 2606 OID 17657)
-- Name: groups groups_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.inspector(id);


--
-- TOC entry 4720 (class 2606 OID 17589)
-- Name: staff staff_driving_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_driving_school_id_fkey FOREIGN KEY (driving_school_id) REFERENCES public.driving_school(id);


--
-- TOC entry 4724 (class 2606 OID 17627)
-- Name: student student_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 4719 (class 2606 OID 17550)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2024-06-29 02:26:39

--
-- PostgreSQL database dump complete
--

