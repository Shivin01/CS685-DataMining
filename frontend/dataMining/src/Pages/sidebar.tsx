import {Button} from "~/components/ui/button"
import {Link, Outlet} from "react-router-dom";
import {Moon, Package2, LogOut, Sun} from "lucide-react";
import {Tooltip, TooltipTrigger} from "~/components/ui/tooltip.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "~/components/ui/dropdown-menu.tsx";
import {useTheme} from "~/provider/theme.tsx";
import {useAuth} from "~/Context/useAuth.tsx";


const Sidebar = () => {
    const {setTheme} = useTheme()
    const {logout} = useAuth();

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                    <Link
                        to="/"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110"/>
                        <span className="sr-only">Detecting DeepFake</span>
                    </Link>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Sun
                                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                                <Moon
                                    className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button"
                                    onClick={logout}
                            >
                                <LogOut className="h-5 w-5"/>
                            </button>
                    </TooltipTrigger>
                </Tooltip>

            </nav>
        </aside>
    <Outlet/>
</>
)
    ;

}

export default Sidebar;