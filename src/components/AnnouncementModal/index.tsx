import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import type { AnnouncementModalProps, DestType, UserResult } from "../../types/components";
import { Modal } from "../Modal";
import {
    searchNotificationUsers,
    sendAnnouncement,
    sendDirectMessage,
} from "../../services/notification.service";
import { theme } from "../../themes/themes";

/* ─── Helpers ───────────────────────────────────────────── */

const normalizeText = (value: string): string =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

const filterUsersIgnoringAccents = (users: UserResult[], query: string): UserResult[] => {
    if (!query.trim()) return users;
    const q = normalizeText(query);
    return users.filter(
        (u) => normalizeText(u.name).includes(q) || normalizeText(u.email).includes(q),
    );
};

/* ─── Styled components ─────────────────────────────────── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
`;

const StyledInput = styled.input`
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.focus};
  }
`;

const StyledTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.focus};
  }
`;

const CharCount = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.text.muted};
  text-align: right;
`;

const ErrorText = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.error};
`;

const SendButton = styled.button`
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.sm};
  border: 0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: ${theme.colors.primary};
  color: #fff;
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.default};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: ${theme.colors.text.secondary};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.surfaceMuted};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 24px 20px;
  border-top: 1px solid ${theme.colors.border.light};
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

const SearchResults = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px 0;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.surface};
  max-height: 180px;
  overflow-y: auto;
`;

const SearchResultItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.88rem;
  color: ${theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background 0.1s;

  &:hover {
    background: ${theme.colors.surfaceHover};
  }

  span {
    font-size: 0.75rem;
    color: ${theme.colors.text.muted};
  }
`;

const SelectedUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border.focus};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.surfaceHover};
  font-size: 0.88rem;
  color: ${theme.colors.text.primary};

  button {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: ${theme.colors.text.muted};
    line-height: 1;
    padding: 0 4px;

    &:hover {
      color: ${theme.colors.error};
    }
  }
`;

/* ─── Component ─────────────────────────────────────────── */

const ROLE_OPTIONS = [
    { value: "PATIENT", label: "Pacientes" },
    { value: "PROFESSIONAL", label: "Profissionais" },
    { value: "RECEPTIONIST", label: "Recepcionistas" },
    { value: "ADMIN", label: "Administradores" },
];

const ROLE_LABELS: Record<string, string> = {
    PATIENT: "Paciente",
    PROFESSIONAL: "Profissional",
    RECEPTIONIST: "Recepcionista",
    ADMIN: "Administrador",
};

/* ─── Component ─────────────────────────────────────────── */

export function AnnouncementModal({ isOpen, onClose, onSuccess }: AnnouncementModalProps) {
    const [destType, setDestType] = useState<DestType>("TODOS");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Usuário específico
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserResult[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Paciente específico (dentro de "Por perfil" quando Pacientes marcado)
    const [patientQuery, setPatientQuery] = useState("");
    const [patientResults, setPatientResults] = useState<UserResult[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<UserResult | null>(null);
    const [isPatientSearching, setIsPatientSearching] = useState(false);
    const patientRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchCacheRef = useRef<Map<string, UserResult[]>>(new Map());
    const patientCacheRef = useRef<Map<string, UserResult[]>>(new Map());

    const showPatientSearch = destType === "PERFIL" && selectedRoles.includes("PATIENT");

    // Debounce — usuário específico
    useEffect(() => {
        if (destType !== "PARTICULAR" || selectedUser) {
            setSearchResults([]);
            return;
        }
        const trimmed = searchQuery.trim();
        if (trimmed.length < 2) {
            setSearchResults([]);
            return;
        }

        const cacheKey = normalizeText(trimmed);

        // Cache exato
        const cached = searchCacheRef.current.get(cacheKey);
        if (cached) {
            setSearchResults(filterUsersIgnoringAccents(cached, trimmed));
            return;
        }
        // Prefixo já cacheado → filtra client-side
        for (const [key, results] of searchCacheRef.current) {
            if (cacheKey.startsWith(key) && key.length >= 2) {
                setSearchResults(filterUsersIgnoringAccents(results, trimmed));
                return;
            }
        }

        let active = true;
        if (searchRef.current) clearTimeout(searchRef.current);
        setIsSearching(true);
        searchRef.current = setTimeout(async () => {
            try {
                const results = await searchNotificationUsers(trimmed);
                if (!active) return;
                searchCacheRef.current.set(cacheKey, results);
                setSearchResults(filterUsersIgnoringAccents(results, trimmed));
            } catch {
                if (active) setSearchResults([]);
            } finally {
                if (active) setIsSearching(false);
            }
        }, 180);
        return () => {
            active = false;
            if (searchRef.current) clearTimeout(searchRef.current);
        };
    }, [searchQuery, destType, selectedUser]);

    // Debounce — paciente específico em "Por perfil"
    useEffect(() => {
        if (!showPatientSearch || selectedPatient) {
            setPatientResults([]);
            return;
        }
        const trimmed = patientQuery.trim();
        if (trimmed.length < 2) {
            setPatientResults([]);
            return;
        }

        const cacheKey = normalizeText(trimmed);

        // Cache exato
        const cached = patientCacheRef.current.get(cacheKey);
        if (cached) {
            setPatientResults(filterUsersIgnoringAccents(cached, trimmed));
            return;
        }
        // Prefixo já cacheado → filtra client-side
        for (const [key, results] of patientCacheRef.current) {
            if (cacheKey.startsWith(key) && key.length >= 2) {
                setPatientResults(filterUsersIgnoringAccents(results, trimmed));
                return;
            }
        }

        let active = true;
        if (patientRef.current) clearTimeout(patientRef.current);
        setIsPatientSearching(true);
        patientRef.current = setTimeout(async () => {
            try {
                const results = (await searchNotificationUsers(trimmed)).filter(
                    (u) => u.role === "PATIENT",
                );
                if (!active) return;
                patientCacheRef.current.set(cacheKey, results);
                setPatientResults(filterUsersIgnoringAccents(results, trimmed));
            } catch {
                if (active) setPatientResults([]);
            } finally {
                if (active) setIsPatientSearching(false);
            }
        }, 180);
        return () => {
            active = false;
            if (patientRef.current) clearTimeout(patientRef.current);
        };
    }, [patientQuery, showPatientSearch, selectedPatient]);

    const handleClose = () => {
        if (isSubmitting) return;
        setDestType("TODOS");
        setSelectedRoles([]);
        setSubject("");
        setMessage("");
        setError(null);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedUser(null);
        setPatientQuery("");
        setPatientResults([]);
        setSelectedPatient(null);
        searchCacheRef.current.clear();
        patientCacheRef.current.clear();
        onClose();
    };

    const toggleRole = (role: string) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
        );
        // limpa paciente selecionado se desmarcar PATIENT
        if (role === "PATIENT") {
            setSelectedPatient(null);
            setPatientQuery("");
            setPatientResults([]);
        }
    };

    const isSubmitDisabled = () => {
        if (!subject.trim() || !message.trim()) return true;
        if (destType === "PERFIL" && selectedRoles.length === 0) return true;
        if (destType === "PARTICULAR" && !selectedUser) return true;
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitDisabled()) {
            if (destType === "PERFIL" && selectedRoles.length === 0) {
                setError("Selecione pelo menos um perfil.");
            } else if (destType === "PARTICULAR" && !selectedUser) {
                setError("Selecione um usuário para enviar a mensagem.");
            } else {
                setError("Assunto e mensagem são obrigatórios.");
            }
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            // Mensagem direta para usuário específico
            if (destType === "PARTICULAR" && selectedUser) {
                await sendDirectMessage({
                    recipientUserId: selectedUser.id,
                    subject: subject.trim(),
                    message: message.trim(),
                });
                onSuccess?.(1);
                // Perfil com paciente específico → mensagem direta
            } else if (destType === "PERFIL" && selectedPatient) {
                await sendDirectMessage({
                    recipientUserId: selectedPatient.id,
                    subject: subject.trim(),
                    message: message.trim(),
                });
                onSuccess?.(1);
                // Perfil sem paciente específico → comunicado por perfis
            } else {
                const result = await sendAnnouncement({
                    subject: subject.trim(),
                    message: message.trim(),
                    targetRoles: destType === "PERFIL" ? selectedRoles : undefined,
                });
                onSuccess?.(result.sent);
            }
            handleClose();
        } catch {
            setError("Erro ao enviar. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalTitle =
        destType === "PARTICULAR" ? "Enviar Mensagem Direta" : "Enviar Comunicado";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
            <Form onSubmit={handleSubmit}>
                {/* Tipo de destinatário */}
                <Field>
                    <Label>Destinatário</Label>
                    <RadioGroup>
                        <RadioLabel>
                            <input
                                type="radio"
                                value="TODOS"
                                checked={destType === "TODOS"}
                                onChange={() => setDestType("TODOS")}
                            />
                            Todos da clínica
                        </RadioLabel>
                        <RadioLabel>
                            <input
                                type="radio"
                                value="PERFIL"
                                checked={destType === "PERFIL"}
                                onChange={() => setDestType("PERFIL")}
                            />
                            Por perfil
                        </RadioLabel>
                        <RadioLabel>
                            <input
                                type="radio"
                                value="PARTICULAR"
                                checked={destType === "PARTICULAR"}
                                onChange={() => setDestType("PARTICULAR")}
                            />
                            Usuário específico
                        </RadioLabel>
                    </RadioGroup>
                </Field>

                {/* Seleção de perfis */}
                {destType === "PERFIL" && (
                    <Field>
                        <Label>Selecione os perfis</Label>
                        <CheckboxGroup>
                            {ROLE_OPTIONS.map((opt) => (
                                <CheckboxLabel key={opt.value}>
                                    <input
                                        type="checkbox"
                                        value={opt.value}
                                        checked={selectedRoles.includes(opt.value)}
                                        onChange={() => toggleRole(opt.value)}
                                    />
                                    {opt.label}
                                </CheckboxLabel>
                            ))}
                        </CheckboxGroup>
                    </Field>
                )}

                {/* Busca de paciente específico (quando Pacientes marcado em Por perfil) */}
                {showPatientSearch && (
                    <Field>
                        <Label>Paciente específico <span style={{ fontWeight: 400, color: theme.colors.text.muted }}>(opcional)</span></Label>
                        {selectedPatient ? (
                            <SelectedUser>
                                <span>{selectedPatient.name}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedPatient(null);
                                        setPatientQuery("");
                                        setPatientResults([]);
                                    }}
                                    title="Remover seleção"
                                >
                                    ×
                                </button>
                            </SelectedUser>
                        ) : (
                            <>
                                <StyledInput
                                    type="text"
                                    value={patientQuery}
                                    onChange={(e) => setPatientQuery(e.target.value)}
                                    placeholder="Buscar paciente pelo nome... (deixe vazio para todos)"
                                />
                                {isPatientSearching && (
                                    <span style={{ fontSize: "0.78rem", color: theme.colors.text.muted }}>Buscando...</span>
                                )}
                                {patientResults.length > 0 && (
                                    <SearchResults>
                                        {patientResults.map((u) => (
                                            <SearchResultItem
                                                key={u.id}
                                                onClick={() => {
                                                    setSelectedPatient(u);
                                                    setPatientResults([]);
                                                    setPatientQuery(u.name);
                                                }}
                                            >
                                                {u.name}
                                                <span>{u.email}</span>
                                            </SearchResultItem>
                                        ))}
                                    </SearchResults>
                                )}
                                {!isPatientSearching && patientQuery.length >= 2 && patientResults.length === 0 && (
                                    <span style={{ fontSize: "0.78rem", color: theme.colors.text.muted }}>Nenhum paciente encontrado.</span>
                                )}
                            </>
                        )}
                    </Field>
                )}

                {/* Busca de usuário específico */}
                {destType === "PARTICULAR" && (
                    <Field>
                        <Label>Buscar usuário</Label>
                        {selectedUser ? (
                            <SelectedUser>
                                <span>
                                    {selectedUser.name}{" "}
                                    <span style={{ color: theme.colors.text.muted, fontSize: "0.78rem" }}>
                                        ({ROLE_LABELS[selectedUser.role] ?? selectedUser.role})
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setSearchQuery("");
                                        setSearchResults([]);
                                    }}
                                    title="Remover seleção"
                                >
                                    ×
                                </button>
                            </SelectedUser>
                        ) : (
                            <>
                                <StyledInput
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Digite o nome do usuário..."
                                />
                                {isSearching && (
                                    <span style={{ fontSize: "0.78rem", color: theme.colors.text.muted }}>
                                        Buscando...
                                    </span>
                                )}
                                {searchResults.length > 0 && (
                                    <SearchResults>
                                        {searchResults.map((u) => (
                                            <SearchResultItem
                                                key={u.id}
                                                onClick={() => {
                                                    setSelectedUser(u);
                                                    setSearchResults([]);
                                                    setSearchQuery(u.name);
                                                }}
                                            >
                                                {u.name}
                                                <span>
                                                    {ROLE_LABELS[u.role] ?? u.role} · {u.email}
                                                </span>
                                            </SearchResultItem>
                                        ))}
                                    </SearchResults>
                                )}
                                {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                                    <span style={{ fontSize: "0.78rem", color: theme.colors.text.muted }}>
                                        Nenhum usuário encontrado.
                                    </span>
                                )}
                            </>
                        )}
                    </Field>
                )}

                {/* Assunto */}
                <Field>
                    <Label htmlFor="ann-subject">Assunto</Label>
                    <StyledInput
                        id="ann-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Informe o assunto"
                        maxLength={200}
                    />
                    <CharCount>{subject.length}/200</CharCount>
                </Field>

                {/* Mensagem */}
                <Field>
                    <Label htmlFor="ann-message">Mensagem</Label>
                    <StyledTextarea
                        id="ann-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escreva a mensagem..."
                        maxLength={2000}
                    />
                    <CharCount>{message.length}/2000</CharCount>
                </Field>

                {error && <ErrorText>{error}</ErrorText>}
            </Form>

            <Actions>
                <CancelButton type="button" onClick={handleClose} disabled={isSubmitting}>
                    Cancelar
                </CancelButton>
                <SendButton
                    type="submit"
                    form=""
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSubmitDisabled()}
                >
                    {isSubmitting ? "Enviando..." : (destType === "PARTICULAR" || (destType === "PERFIL" && selectedPatient)) ? "Enviar Mensagem" : "Enviar Comunicado"}
                </SendButton>
            </Actions>
        </Modal>
    );
}

