'use client';
import React, { useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, ChipProps, getKeyValue, Pagination, Spinner, useDisclosure, Input } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import useSWR from "swr";
import { SearchIcon } from "./SearchIcon";
import { useDebounce } from "@/lib/useDebounce";

const columns = [
    { name: "EMAIL", uid: "email" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "STATUS", uid: "maxRequests" },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = (maxRequests: number) => {
    const r = {
        paid: "success",
        free: "danger",
    }

    if (maxRequests !== 5) {
        return { color: r.paid, text: "paid" };
    }
    return { color: r.free, text: "free" };
};

const fetcher = (url: string) => (
    fetch(url)
        .then((res) => res.json())
        .then((data) => data)
);

export default function Show() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tempAccessKey, setTempAccessKey] = React.useState({} as any);
    const [search, setSearch] = React.useState("");
    const path = typeof window !== "undefined" ? window.location.origin : "";

    const handleOpen = () => {
        onOpen();
    }

    const updateAccessKey = async (data: any) => {
        try {
            const res = await fetch(`/api/check?sh=si`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.status) {
                throw new Error(json.message);
            }
            alert(json.message);
        } catch (err: any) {
            alert(err.message);
            console.error(err);
        }
    }

    const [page, setPage] = React.useState(1);
    const onSearchChange = (value: string) => {
        if (value === null || value === undefined || value === "") {
            value = "";
        }
        setSearch(value);
    };

    const debouncedSearch = useDebounce(search, 700);
    const { data, isLoading, mutate } = useSWR(path + `/api/check?sh=si&page=${page}&search=${debouncedSearch}`, fetcher, {
        keepPreviousData: true,
        refreshInterval: 1000 * 60 * 3,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.totalPage ? Math.ceil(data.totalPage / rowsPerPage) : 0;
    }, [data?.totalPage, rowsPerPage]);

    const loadingState = isLoading ? "loading" : "idle";

    const renderCell = React.useCallback((accessKey: any, columnKey: string) => {
        const cellValue = getKeyValue(accessKey, columnKey);
        switch (columnKey) {
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{cellValue}</p>
                        <p className="text-bold text-sm text-default-400">{accessKey.accessKey.substring(0, 20)}...</p>
                    </div>
                );
            case "createdAt":
                return (
                    <Chip color="warning" variant="faded" className="whitespace-nowrap text-sm">
                        {new Date(cellValue).toDateString()}
                    </Chip>
                );
            case "maxRequests":
                return (
                    <Chip className="capitalize" size="sm" variant="flat" color={statusColorMap(accessKey.maxRequests).color as ChipProps["color"]}>
                        {statusColorMap(accessKey.maxRequests).text}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Update Plan">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon onClick={() => {
                                    setTempAccessKey({ _id: accessKey._id, maxRequests: accessKey.maxRequests, expiresAt: accessKey.expiresAt });
                                    handleOpen();
                                }} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <Input
                isClearable
                classNames={{
                    base: "w-full",
                    inputWrapper: "border-1",
                }}
                placeholder="Search by name..."
                size="md"
                startContent={<SearchIcon className="text-default-300" />}
                value={search}
                variant="bordered"
                onClear={() => setSearch("")}
                onValueChange={onSearchChange}
            />
        );
    }, [
        onSearchChange,
    ]);

    return (
        <>
            <Table
                aria-label="Access Keys"
                className="max-w-4xl mx-auto"
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
                topContent={topContent}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={data?.accessKeys ?? []}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                    emptyContent="No data found"
                >
                    {(item: any) => (
                        <TableRow key={item._id}>
                            {(columnKey: any) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Update Plan
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Max Requests"
                                    placeholder="Enter max requests"
                                    type="number"
                                    value={tempAccessKey.maxRequests}
                                    onChange={(e) => setTempAccessKey({ ...tempAccessKey, maxRequests: e.target.value })}
                                    variant="bordered"
                                />
                                <Input
                                    autoFocus
                                    label="Expires At"
                                    placeholder="Enter expires at"
                                    type="date"
                                    value={new Date(tempAccessKey.expiresAt).toISOString().split('T')[0]}
                                    onChange={(e) => setTempAccessKey({ ...tempAccessKey, expiresAt: e.target.value })}
                                    variant="bordered"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        updateAccessKey(tempAccessKey);
                                        if (search !== "") {
                                            setSearch("");
                                            onClose();
                                            return;
                                        }
                                        mutate();
                                        onClose();
                                    }}>
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
